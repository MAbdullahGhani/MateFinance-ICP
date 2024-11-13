import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Bool "mo:base/Bool";
import Int "mo:base/Int";
import Map "mo:base/HashMap";
import Time "mo:base/Time";
import Buffer "mo:base/Buffer";
import Hash "mo:base/Hash";
import ICRC "./ICRC";
import Result "mo:base/Result";
import Nat64 "mo:base/Nat64";
import Error "mo:base/Error";
import Iter "mo:base/Iter";
import Nat32 "mo:base/Nat32";

shared (msg) actor class IcpInvoiceMateContract() = this {

  func natHash(n : Nat) : Hash.Hash {
    var x = n;
    var h : Nat32 = 0;
    while (x > 0) {
      h := h +% Nat32.fromNat(x % 256);
      h := h *% 2654435761;
      x := x / 256;
    };
    h;
  };

  public type BorrowerStatus = {
    #FINANCEREQUESTED;
    #TOKENIZED;
    #LENDED;
    #REPAID;
    #REJECTED;
    #CLOSED;
  };
  public type Tokens = Nat;

  public type BorrowerData = {
    totalAmount : Nat;
    borrowCount : Nat;
    isExist : Bool;
  };
  public type LenderData = {
    totalAmount : Nat;
    lendCount : Nat;
    isExist : Bool;
  };
  public type Error = ICRC.TransferFromError or {
    #error : Text;
  };

  public type BorrowerLoanDetails = {
    assignedNFT : Nat;
    lender : ICRC.Account;
    principalAmount : Nat;
    apy : Nat;
    loanStartTime : Nat;
    requestDate : Nat;
    duration : Nat;
    lendId : Nat;
    tokenURI : Text;
    fundsReceived : Bool;
    repaid : Bool;
  };

  public type LenderDetails = {
    usdcAmount : Nat;
    lendStartTime : Nat;
    repaymentReciveTime : Nat;
    repaymentRecived : Nat;
    claimed : Bool;
  };
  public type Result<T, E> = { #Ok : T; #Err : E };

  var _borrowerLoanDetails = Map.HashMap<Principal, Map.HashMap<Nat, BorrowerLoanDetails>>(0, Principal.equal, Principal.hash);

  var _userBorrowStatus = Map.HashMap<Principal, Map.HashMap<Nat, BorrowerStatus>>(0, Principal.equal, Principal.hash);

  var _lenderDetails = Map.HashMap<Principal, Map.HashMap<Nat, LenderDetails>>(0, Principal.equal, Principal.hash);

  var _borrowerData = Map.HashMap<Principal, BorrowerData>(0, Principal.equal, Principal.hash);

  var _lenderData = Map.HashMap<Principal, LenderData>(0, Principal.equal, Principal.hash);

  var _totalIncomings = Map.HashMap<Nat, Nat>(0, Nat.equal, natHash);

  var _totalOutgoings = Map.HashMap<Nat, Nat>(0, Nat.equal, natHash);

  stable var daysInterval : Nat = 0;
  stable var daysInYear : Nat = 0;
  stable var launchTime : Nat = 0;
  stable var percentDivider : Nat = 0;
  stable var defaMultiplier : Nat = 0;
  stable var tokenId : Nat = 0;
  stable var collectedInvoiceMateFunds : Nat = 0;
  stable var collectedinsurancePoolFunds : Nat = 0;
  stable var currentDay : Nat = 0;
  stable var lenderPercentage : Nat = 0;
  stable var poolPercentage : Nat = 0;
  stable var invoiceMatePercentage : Nat = 0;
  stable var borrowers : [ICRC.Account] = [];
  stable var lenders : [ICRC.Account] = [];
  stable var pool : ICRC.Account = {
    owner = Principal.fromText("2vxsx-fae");
    subaccount = null;
  };
  stable var imFundsReceiver : ICRC.Account = {
    owner = Principal.fromText("2vxsx-fae");
    subaccount = null;
  };
  stable var defaultAdmin : ICRC.Account = {
    owner = Principal.fromText("2vxsx-fae");
    subaccount = null;
  };
  stable var launch : Bool = false;

  stable var usdc : ICRC.Actor = actor (Principal.toText(Principal.fromText("2vxsx-fae")));
  stable var defa : ICRC.Actor = actor (Principal.toText(Principal.fromText("2vxsx-fae")));

  stable var stableBorrowerLoanDetails : [(Principal, [(Nat, BorrowerLoanDetails)])] = [];
  stable var stableUserBorrowStatus : [(Principal, [(Nat, BorrowerStatus)])] = [];
  stable var stableLenderDetails : [(Principal, [(Nat, LenderDetails)])] = [];
  stable var stableBorrowerData : [(Principal, BorrowerData)] = [];
  stable var stableLenderData : [(Principal, LenderData)] = [];
  stable var stableTotalIncomings : [(Nat, Nat)] = [];
  stable var stableTotalOutgoings : [(Nat, Nat)] = [];
  stable var initialized : Bool = false;

  private func isAdmin(caller : Principal) : Bool {
    Principal.equal(caller, defaultAdmin.owner);
  };

  public func initialize(_pool : ICRC.Account, _usdc : Principal, _defaultAdmin : ICRC.Account, _imfundsReceiver : ICRC.Account, _defa : Principal) : async Text {
    assert (not initialized);

    defaultAdmin := _defaultAdmin;
    imFundsReceiver := _imfundsReceiver;
    pool := _pool;
    usdc := actor (Principal.toText(_usdc));
    defa := actor (Principal.toText(_defa));
    launchTime := Int.abs(Time.now());
    launch := true;
    percentDivider := 10000;
    defaMultiplier := 10 ** 12;
    daysInterval := 24 * 60 * 60 * 1_000_000_000;
    daysInYear := 365;
    lenderPercentage := 10000;
    poolPercentage := 0;
    invoiceMatePercentage := 0;
    initialized := true;

    return "Initialization complete";
  };

  func calculateDay() : Nat {
    return Nat.div(Nat.sub(Int.abs(Time.now()), launchTime), daysInterval);
  };

  public func updateDay() {
    if (currentDay != calculateDay()) {
      currentDay := calculateDay();
    };
  };

  public shared (msg) func whoami() : async Principal {
    msg.caller;
  };

  public shared (msg) func requestLoan(_borrower : ICRC.Account, _principalAmount : Nat, _loanTerm : Nat, _tokenURI : Text, _apy : Nat) : async Result.Result<(Nat, Principal), Text> {

    if (not isAdmin(msg.caller)) {
      return #err("Unauthorized: Only admin can call this function");
    };
    switch (_borrowerData.get(_borrower.owner)) {
      case (null) { #err("Borrower does not exist") };
      case (?borrow) {
        var borrowCount = Nat.add(borrow.borrowCount, 1);
        switch (_borrowerLoanDetails.get(_borrower.owner)) {
          case (null) {
            let map = Map.HashMap<Nat, BorrowerLoanDetails>(0, Nat.equal, natHash);
            let borrowdata = {
              borrow with
              borrowCount = borrowCount;
              totalAmount = Nat.add(borrow.totalAmount, _principalAmount);
            };
            _borrowerData.put(_borrower.owner, borrowdata);
            let userBorrow : BorrowerLoanDetails = {
              assignedNFT = 0;
              lender = {
                owner = Principal.fromText("2vxsx-fae");
                subaccount = null;
              };
              principalAmount = _principalAmount;
              apy = Nat.mul(_apy, 100);
              loanStartTime = 0;
              requestDate = Int.abs(Time.now());
              duration = _loanTerm;
              lendId = 0;
              tokenURI = _tokenURI;
              fundsReceived = false;
              repaid = false;
            };
            map.put(borrowCount, userBorrow);

            _borrowerLoanDetails.put(_borrower.owner, map);
            setBorrowerStatus(_borrower.owner, borrowCount, #TOKENIZED);
            return #ok(borrowCount, _borrower.owner);
          };
          case (?value) {
            let borrowdata = {
              borrow with
              borrowCount = borrowCount;
              totalAmount = Nat.add(borrow.totalAmount, _principalAmount);
            };
            _borrowerData.put(_borrower.owner, borrowdata);
            let userBorrow : BorrowerLoanDetails = {
              assignedNFT = 0;
              lender = {
                owner = Principal.fromText("2vxsx-fae");
                subaccount = null;
              };
              principalAmount = _principalAmount;
              apy = Nat.mul(_apy, 100);
              loanStartTime = 0;
              requestDate = Int.abs(Time.now());
              duration = _loanTerm;
              lendId = 0;
              tokenURI = _tokenURI;
              fundsReceived = false;
              repaid = false;
            };
            value.put(borrowCount, userBorrow);

            _borrowerLoanDetails.put(_borrower.owner, value);
            setBorrowerStatus(_borrower.owner, borrowCount, #TOKENIZED);
            return #ok(borrowCount, _borrower.owner);
          };
        };

      };
    };
  };

  public shared (msg) func approveLoan(_lender : ICRC.Account, _borrower : ICRC.Account, _id : Nat) : async Result<Bool, Error> {

    if (not isAdmin(msg.caller)) {
      return #Err(#error("Unauthorized: Only admin can call this function"));
    };
    tokenId := Nat.add(tokenId, 1);

    switch (_borrowerData.get(_borrower.owner)) {
      case (null) { return #Err(#error("Borrower does not exist")) };
      case (?borrower) {
        if (borrower.isExist != true) {
          return #Err(#error("borrower has no existence"));
        };
      };
    };

    switch (_lenderData.get(_lender.owner)) {
      case (null) { return #Err(#error("Lender does not exist")) };
      case (?lender) {
        if (lender.isExist != true) {
          return #Err(#error("lender has no existence"));
        };
      };
    };
    switch (_borrowerLoanDetails.get(_borrower.owner)) {
      case (null) { return #Err(#error("Loan details not found")) };
      case (?loanMap) {
        switch (loanMap.get(_id)) {
          case (null) { return #Err(#error("Invalid loan ID")) };
          case (?userBorrow) {
            switch (_userBorrowStatus.get(_borrower.owner)) {
              case (null) { return #Err(#error("Borrower status not found")) };
              case (?statusMap) {
                switch (statusMap.get(_id)) {
                  case (? #REJECTED) {
                    return #Err(#error("This loan request is rejected!"));
                  };
                  case _ {};
                };
              };
            };
            if (userBorrow.loanStartTime != 0) {
              return #Err(#error("Loan is already financed"));
            };
            if (userBorrow.principalAmount == 0) {
              return #Err(#error("Invalid principal amount"));
            };

            let lenderBalance : Nat = await getUSDCBalance(_lender);
            if (lenderBalance < userBorrow.principalAmount) {
              return #Err(#error("Lender balance not enough"));
            };
            let actorPrincipal : ICRC.Account = {
              owner = Principal.fromActor(this);
              subaccount = null;
            };
            let _transferResult = await usdcTransferFrom(_lender, actorPrincipal, userBorrow.principalAmount);
            switch (_transferResult) {
              case (#Ok(_)) {};
              case (#Err(e)) { return #Err(e) };
            };
            let _transferResult2 = await _usdcTransfer(_borrower, userBorrow.principalAmount);
            switch (_transferResult2) {
              case (#Ok(_)) {};
              case (#Err(e)) { return #Err(e) };
            };

            let user = {
              userBorrow with
              assignedNFT = tokenId;
              loanStartTime = Int.abs(Time.now());
              fundsReceived = true;
            };
            let _defamint = await _defaTransfer(_lender, Nat.mul(userBorrow.principalAmount, defaMultiplier));
            switch (_defamint) {
              case (#Ok(_)) {};
              case (#Err(e)) { return #Err(e) };
            };
            let res = await setLendingDetails(_lender, userBorrow.principalAmount, _borrower, _id);
            switch (res) {
              case (#ok(_)) {};
              case (#err(e)) { return #Err(#error(e)) };
            };
            loanMap.put(_id, user);
            _borrowerLoanDetails.put(_borrower.owner, loanMap);
            setBorrowerStatus(_borrower.owner, _id, #TOKENIZED);

            updateDay();
            let incomingAmount = switch (_totalIncomings.get(Int.abs(currentDay))) {
              case (null) { userBorrow.principalAmount };
              case (?amount) {
                Nat.add(amount, userBorrow.principalAmount);
              };
            };
            _totalIncomings.put(Int.abs(currentDay), incomingAmount);

            return #Ok(true);
          };
        };
      };
    };
  };

  public shared (msg) func repayLoan(_borrower : ICRC.Account, _id : Nat) : async Result<Bool, Error> {
    if (not isAdmin(msg.caller)) {
      return #Err(#error("Unauthorized: Only admin can call this function"));
    };
    switch (_borrowerData.get(_borrower.owner)) {
      case (null) { return #Err(#error("Borrower does not exist")) };
      case (?borrower) {
        if (borrower.isExist != true) {
          return #Err(#error("borrower has no existence"));
        };
      };
    };
    switch (_borrowerLoanDetails.get(_borrower.owner)) {
      case (null) { return #Err(#error("Loan details not found")) };
      case (?loanMap) {
        switch (loanMap.get(_id)) {
          case (null) { return #Err(#error("Invalid loan ID")) };
          case (?userBorrow) {

            if (userBorrow.repaid == true) {
              return #Err(#error("borrower have already paid loan Amount"));
            };

            switch (_lenderDetails.get(userBorrow.lender.owner)) {
              case (null) {
                return #Err(#error("Lender details not found"));
              };
              case (?lendingMap) {
                switch (lendingMap.get(userBorrow.lendId)) {
                  case (null) { return #Err(#error("Invalid loan ID")) };
                  case (?lending) {
                    var amount = 0;
                    let result = await getBorrowertotalRepayment(_borrower, _id);
                    switch (result) {
                      case (#ok(_amount)) { amount := _amount };
                      case (#err(e)) { return #Err(#error(e)) };
                    };
                    let lenderShare = Nat.div(Nat.mul(amount, lenderPercentage), percentDivider);
                    let poolShare = Nat.div(Nat.mul(amount, poolPercentage), percentDivider);
                    let invoiceMateShare = Nat.div(Nat.mul(amount, invoiceMatePercentage), percentDivider);

                    let actorPrincipal : ICRC.Account = {
                      owner = Principal.fromActor(this);
                      subaccount = null;
                    };
                    let _transferResult = await usdcTransferFrom(_borrower, actorPrincipal, Nat.add(userBorrow.principalAmount, amount));
                    switch (_transferResult) {
                      case (#Ok(_)) {};
                      case (#Err(e)) { return #Err(e) };
                    };
                    let _transferResult2 = await _usdcTransfer(userBorrow.lender, Nat.add(userBorrow.principalAmount, lenderShare));
                    switch (_transferResult2) {
                      case (#Ok(_)) {};
                      case (#Err(e)) { return #Err(e) };
                    };
                    if (poolShare > 0) {
                      let _transferResult3 = await _usdcTransfer(userBorrow.lender, poolShare);
                      switch (_transferResult3) {
                        case (#Ok(_)) {
                          collectedinsurancePoolFunds := Nat.add(collectedinsurancePoolFunds, poolShare);
                        };
                        case (#Err(e)) { return #Err(e) };
                      };
                    };

                    if (invoiceMateShare > 0) {
                      let _transferResult4 = await _usdcTransfer(imFundsReceiver, invoiceMateShare);
                      switch (_transferResult4) {
                        case (#Ok(_)) {
                          collectedInvoiceMateFunds := Nat.add(collectedInvoiceMateFunds, invoiceMateShare);
                        };
                        case (#Err(e)) { return #Err(e) };
                      };
                    };

                    let defaBurnResult = await _defaTransferFrom(userBorrow.lender, defaultAdmin, userBorrow.principalAmount);
                    switch (defaBurnResult) {
                      case (#Ok(_)) {};
                      case (#Err(e)) { return #Err(e) };
                    };

                    let updateUserBorrow = { userBorrow with repaid = true };
                    loanMap.put(_id, updateUserBorrow);
                    _borrowerLoanDetails.put(_borrower.owner, loanMap);

                    let updateLending = {
                      lending with
                      repaymentReciveTime = Int.abs(Time.now());
                      repaymentRecived = Nat.add(userBorrow.principalAmount, lenderShare);
                      claimed = true;

                    };
                    lendingMap.put(userBorrow.lendId, updateLending);
                    _lenderDetails.put(userBorrow.lender.owner, lendingMap);

                    setBorrowerStatus(_borrower.owner, _id, #REPAID);
                    updateDay();
                    let outgoing = switch (_totalOutgoings.get(Int.abs(currentDay))) {
                      case (null) {
                        Nat.add(userBorrow.principalAmount, poolShare);
                      };
                      case (?amount) {
                        Nat.add(amount, Nat.add(userBorrow.principalAmount, poolShare));
                      };
                    };
                    _totalOutgoings.put(Int.abs(currentDay), outgoing);

                  };
                };
              };
            };

            return #Ok(true);
          };
        };
      };
    };
  };

  private func usdcTransferFrom(_from : ICRC.Account, _to : ICRC.Account, _amount : Nat) : async Result<ICRC.TxIndex, ICRC.TransferFromError> {
    let transferFromArgs : ICRC.TransferFromArgs = {
      spender_subaccount = null;
      from = _from;
      to = _to;
      amount = _amount;
      fee = null;
      memo = null;
      created_at_time = ?Nat64.fromNat(Int.abs(Time.now()));
    };
    let _result = await usdc.icrc2_transfer_from(transferFromArgs);

  };

  private func _usdcTransfer(_to : ICRC.Account, _amount : Nat) : async Result<ICRC.TxIndex, ICRC.TransferError> {
    let transferArgs : ICRC.TransferArg = {
      from_subaccount = null;
      to = _to;
      amount = _amount;
      fee = null;
      memo = null;
      created_at_time = ?Nat64.fromNat(Int.abs(Time.now()));
    };
    let _result = await usdc.icrc1_transfer(transferArgs);

  };

  private func _defaTransferFrom(_from : ICRC.Account, _to : ICRC.Account, _amount : Nat) : async Result<ICRC.TxIndex, ICRC.TransferFromError> {
    let transferFromArgs : ICRC.TransferFromArgs = {
      spender_subaccount = null;
      from = _from;
      to = _to;
      amount = _amount;
      fee = null;
      memo = null;
      created_at_time = ?Nat64.fromNat(Int.abs(Time.now()));
    };
    let _result = await defa.icrc2_transfer_from(transferFromArgs);

  };

  private func _defaTransfer(_to : ICRC.Account, _amount : Nat) : async Result<ICRC.TxIndex, ICRC.TransferError> {
    let transferArgs : ICRC.TransferArg = {
      from_subaccount = null;
      to = _to;
      amount = _amount;
      fee = null;
      memo = null;
      created_at_time = ?Nat64.fromNat(Int.abs(Time.now()));
    };
    let _result = await defa.icrc1_transfer(transferArgs);

  };

  private func setLendingDetails(_lender : ICRC.Account, _usdcAmount : Nat, _borrower : ICRC.Account, _id : Nat) : async Result.Result<Bool, Text> {
    switch (_borrowerLoanDetails.get(_borrower.owner)) {
      case (null) {
        #err("Borrower loan details not found.");
      };
      case (?loanMap) {
        switch (loanMap.get(_id)) {
          case (null) {
            #err("Loan ID not found.");
          };
          case (?userBorrow) {
            switch (_lenderData.get(_lender.owner)) {
              case (null) {
                #err("Lender data not found.");
              };
              case (?lenderData) {
                let newLendCount = Nat.add(lenderData.lendCount, 1);
                let updatedLenderData = {
                  lenderData with
                  lendCount = newLendCount;
                  totalAmount = Nat.add(lenderData.totalAmount, _usdcAmount);
                };
                _lenderData.put(_lender.owner, updatedLenderData);

                switch (_lenderDetails.get(_lender.owner)) {
                  case (null) {
                    let lenderMap = Map.HashMap<Nat, LenderDetails>(0, Nat.equal, natHash);
                    let newLendingDetails : LenderDetails = {
                      usdcAmount = _usdcAmount;
                      lendStartTime = Int.abs(Time.now());
                      repaymentReciveTime = 0;
                      repaymentRecived = 0;
                      claimed = false;
                    };
                    lenderMap.put(newLendCount, newLendingDetails);
                    _lenderDetails.put(_lender.owner, lenderMap);
                  };
                  case (?lenderMap) {
                    let newLendingDetails : LenderDetails = {
                      usdcAmount = _usdcAmount;
                      lendStartTime = Int.abs(Time.now());
                      repaymentReciveTime = 0;
                      repaymentRecived = 0;
                      claimed = false;
                    };
                    lenderMap.put(newLendCount, newLendingDetails);
                    _lenderDetails.put(_lender.owner, lenderMap);
                  };
                };

                let updatedBorrowerLoan = {
                  userBorrow with
                  lender = _lender;
                  lendId = newLendCount;
                };
                loanMap.put(_id, updatedBorrowerLoan);
                _borrowerLoanDetails.put(_borrower.owner, loanMap);
                #ok(true);
              };
            };
          };
        };
      };
    };
  };

  public func getBorrowertotalRepayment(_borrower : ICRC.Account, _id : Nat) : async Result.Result<Nat, Text> {
    switch (_borrowerLoanDetails.get(_borrower.owner)) {
      case (null) { return #err("Loan details not found") };
      case (?loanMap) {
        switch (loanMap.get(_id)) {
          case (null) { return #err("Invalid loan ID") };
          case (?userBorrow) {

            var amount : Nat = Nat.div(Nat.div((Nat.mul(userBorrow.principalAmount, userBorrow.apy)), percentDivider), daysInYear);
            var timeMultiplier : Nat = 0;
            let durationinDays : Nat = Nat.div(Nat.sub(Int.abs(Time.now()), userBorrow.loanStartTime), daysInterval);
            if (Nat.lessOrEqual(durationinDays, Nat.add(userBorrow.duration, 1))) {
              timeMultiplier := userBorrow.duration;
            } else {
              timeMultiplier := durationinDays;

            };
            amount := Nat.mul(timeMultiplier, amount);

            return #ok(amount);

          };
        };
      };
    };

  };

  public shared (msg) func changeStateOfLoan(
    _borrower : ICRC.Account,
    _id : Nat,
    _state : BorrowerStatus,
  ) : async Result.Result<Bool, Text> {
    if (not isAdmin(msg.caller)) {
      return #err("Unauthorized: Only admin can call this function");
    };

    switch (_borrowerData.get(_borrower.owner)) {
      case (null) { return #err("Borrower has no existence") };
      case (?user) {
        if (user.isExist != true) {
          return #err("Borrower has no existence");
        };
      };
    };

    switch (_borrowerLoanDetails.get(_borrower.owner)) {
      case (null) { return #err("Loan details not found") };
      case (?loanMap) {
        switch (loanMap.get(_id)) {
          case (null) { return #err("Invalid loan ID") };
          case (?userBorrow) {
            if (Nat.lessOrEqual(userBorrow.principalAmount, 0)) {
              return #err("Borrower ID has no existence");
            };
          };
        };
      };
    };

    setBorrowerStatus(_borrower.owner, _id, _state);
    #ok(true);
  };

 private func setBorrowerStatus(_user : Principal, _id : Nat, _status : BorrowerStatus) {
    switch (_userBorrowStatus.get(_user)) {
      case (null) {
        let statusMap = Map.HashMap<Nat, BorrowerStatus>(0, Nat.equal, natHash);
        statusMap.put(_id, _status);
        _userBorrowStatus.put(_user, statusMap);
      };
      case (?value) {
        value.put(_id, _status);
        _userBorrowStatus.put(_user, value);
      };
    };
  };

  public shared (msg) func _whitelistLenderAddress(_lender : ICRC.Account) : async Result.Result<Bool, Text> {
    if (not isAdmin(msg.caller)) {
      return #err("Unauthorized: Only admin can call this function");
    };
    switch (_lenderData.get(_lender.owner)) {
      case (null) {
        let array = Buffer.fromArray<ICRC.Account>(lenders);
        array.add(_lender);
        lenders := Buffer.toArray(array);
        let lender : LenderData = {
          lendCount = 0;
          isExist = true;
          totalAmount = 0;
        };
        _lenderData.put(_lender.owner, lender);
        #ok(true);

      };
      case (?value) {
        if (value.isExist != true) {
          let array = Buffer.fromArray<ICRC.Account>(lenders);
          array.add(_lender);
          lenders := Buffer.toArray(array);
          let data = {
            value with
            isExist = true;
          };
          _lenderData.put(_lender.owner, data);
        };
        #ok(true);

      };
    };
  };

  public shared (msg) func _whitelistBorrowerAddress(_borrower : ICRC.Account) : async Result.Result<Bool, Text> {
    if (not isAdmin(msg.caller)) {
      return #err("Unauthorized: Only admin can call this function");
    };
    switch (_borrowerData.get(_borrower.owner)) {
      case (null) {
        let array = Buffer.fromArray<ICRC.Account>(borrowers);
        array.add(_borrower);
        borrowers := Buffer.toArray(array);
        let borrow : BorrowerData = {
          borrowCount = 0;
          isExist = true;
          totalAmount = 0;
        };
        _borrowerData.put(_borrower.owner, borrow);

        #ok(true)

      };
      case (?value) {
        if (value.isExist != true) {
          let array = Buffer.fromArray<ICRC.Account>(borrowers);
          array.add(_borrower);
          borrowers := Buffer.toArray(array);
          let data = {
            value with
            isExist = true;
          };
          _borrowerData.put(_borrower.owner, data);
        };
        #ok(true);

      };
    };
  };

  public shared (msg) func setPercentageMultiplier(_val1 : Nat, _val2 : Nat, _val3 : Nat) : async Result.Result<Bool, Text> {
    if (not isAdmin(msg.caller)) {
      return #err("Unauthorized: Only admin can call this function");
    };
    lenderPercentage := _val1;
    poolPercentage := _val2;
    invoiceMatePercentage := _val3;
    #ok(true);
  };

  public shared (msg) func setPoolInsuranceAddress(_pool : ICRC.Account) : async Result.Result<Bool, Text> {
    if (not isAdmin(msg.caller)) {
      return #err("Unauthorized: Only admin can call this function");
    };
    pool := _pool;
    #ok(true);
  };

  public shared (msg) func setImFundsReceiver(_imfundsReceiver : ICRC.Account) : async Result.Result<Bool, Text> {
    if (not isAdmin(msg.caller)) {
      return #err("Unauthorized: Only admin can call this function");
    };
    imFundsReceiver := _imfundsReceiver;
    #ok(true);
  };

  public shared (msg) func changeUsdcAddress(_usdc : Principal) : async Result.Result<Bool, Text> {
    if (not isAdmin(msg.caller)) {
      return #err("Unauthorized: Only admin can call this function");
    };
    usdc := actor (Principal.toText(_usdc));
    #ok(true);
  };
  public shared (msg) func changeDefaAddress(_defa : Principal) : async Result.Result<Bool, Text> {
    if (not isAdmin(msg.caller)) {
      return #err("Unauthorized: Only admin can call this function");
    };
    defa := actor (Principal.toText(_defa));
    #ok(true);
  };

  public func getBorrowersLength() : async Nat {
    borrowers.size();
  };
  public func getBorrowers() : async [ICRC.Account] {
    borrowers;
  };

  public func getLendersLength() : async Nat {
    lenders.size();
  };

  public func getLenders() : async [ICRC.Account] {
    lenders;
  };
  public func getBorrowerStatus(_user : Principal, _id : Nat) : async ?BorrowerStatus {
    switch (_userBorrowStatus.get(_user)) {
      case (null) {
        null;
      };
      case (?value) { value.get(_id) };
    };
  };

  public shared (msg) func withdrawStuckTokenFunds(_token : Principal, _amount : Nat) : async Result<ICRC.TxIndex, Error> {
    if (not isAdmin(msg.caller)) {
      return #Err(#error("Unauthorized: Only admin can call this function"));
    };
    let TokenContract : ICRC.Actor = actor (Principal.toText(_token));
    let actorPrincipal : ICRC.Account = {
      owner = Principal.fromActor(this);
      subaccount = null;
    };
    let arg : ICRC.TransferArg = {
      from_subaccount = actorPrincipal.subaccount;
      to = { owner = msg.caller; subaccount = null };
      amount = _amount;
      fee = null;
      memo = null;
      created_at_time = ?Nat64.fromNat(Int.abs(Time.now()));
    };
    let _result = await TokenContract.icrc1_transfer(arg);

  };

  public func getBorrowerLoanDetails(_user : Principal, _id : Nat) : async ?BorrowerLoanDetails {
    switch (_borrowerLoanDetails.get(_user)) {
      case (null) {
        null;
      };
      case (?value) { value.get(_id) };
    };
  };

  public func borrowerExist(user : Principal) : async Bool {
    switch (_borrowerData.get(user)) {
      case (null) {
        false;
      };
      case (?value) {
        value.isExist;
      };
    };
  };

  public func lenderExist(user : Principal) : async Bool {
    switch (_lenderData.get(user)) {
      case (null) {
        false;
      };
      case (?value) {
        value.isExist;
      };
    };
  };
  public func getUSDCBalance(user : ICRC.Account) : async Nat {
    return await usdc.icrc1_balance_of(user);
  };

  public func currentState() : async (Nat, Nat) {
    var incoming : Nat = 0;
    var outgoing : Nat = 0;

    switch (_totalIncomings.get(Int.abs(currentDay))) {
      case (null) { incoming := 0 };
      case (?value) { incoming := value };
    };

    switch (_totalOutgoings.get(Int.abs(currentDay))) {
      case (null) { outgoing := 0 };
      case (?value) { outgoing := value };
    };

    return (incoming, outgoing);
  };
  public query func getAllBorrowerLoanDetails() : async [(Principal, [(Nat, BorrowerLoanDetails)])] {
    var array = Buffer.Buffer<(Principal, [(Nat, BorrowerLoanDetails)])>(0);
    for ((x, y) in Iter.fromArray(Iter.toArray(_borrowerLoanDetails.entries()))) {
      var tempArray : [(Nat, BorrowerLoanDetails)] = [];
      tempArray := Iter.toArray(y.entries());
      array.add(x, tempArray);
    };
    return Buffer.toArray<(Principal, [(Nat, BorrowerLoanDetails)])>(array);
  };

  public query func getAllUsersBorrowStatus() : async [(Principal, [(Nat, BorrowerStatus)])] {
    var array = Buffer.Buffer<(Principal, [(Nat, BorrowerStatus)])>(0);
    for ((x, y) in Iter.fromArray(Iter.toArray(_userBorrowStatus.entries()))) {
      var tempArray : [(Nat, BorrowerStatus)] = [];
      tempArray := Iter.toArray(y.entries());
      array.add(x, tempArray);
    };
    return Buffer.toArray<(Principal, [(Nat, BorrowerStatus)])>(array);
  };
  public query func getAllUsersLendersDetails() : async [(Principal, [(Nat, LenderDetails)])] {
    var array = Buffer.Buffer<(Principal, [(Nat, LenderDetails)])>(0);
    for ((x, y) in Iter.fromArray(Iter.toArray(_lenderDetails.entries()))) {
      var tempArray : [(Nat, LenderDetails)] = [];
      tempArray := Iter.toArray(y.entries());
      array.add(x, tempArray);
    };
    return Buffer.toArray<(Principal, [(Nat, LenderDetails)])>(array);
  };

  public query func getAllBorrowersData() : async [(Principal, BorrowerData)] {
    var tempArray : [(Principal, BorrowerData)] = [];
    tempArray := Iter.toArray(_borrowerData.entries());
    return tempArray;
  };
  public query func getAllLendersData() : async [(Principal, LenderData)] {
    var tempArray : [(Principal, LenderData)] = [];
    tempArray := Iter.toArray(_lenderData.entries());
    return tempArray;
  };

  public query func getAllIncomings() : async [(Nat, Nat)] {
    var tempArray : [(Nat, Nat)] = [];
    tempArray := Iter.toArray(_totalIncomings.entries());
    return tempArray;
  };
  public query func getAllOutgoings() : async [(Nat, Nat)] {
    var tempArray : [(Nat, Nat)] = [];
    tempArray := Iter.toArray(_totalOutgoings.entries());
    return tempArray;
  };

  system func preupgrade() {
    var borrowerLoanArray = Buffer.Buffer<(Principal, [(Nat, BorrowerLoanDetails)])>(0);
    for ((x, y) in Iter.fromArray(Iter.toArray(_borrowerLoanDetails.entries()))) {
      var tempArray : [(Nat, BorrowerLoanDetails)] = [];
      tempArray := Iter.toArray(y.entries());
      borrowerLoanArray.add(x, tempArray);
    };
    var borrowerStatusArray = Buffer.Buffer<(Principal, [(Nat, BorrowerStatus)])>(0);
    for ((x, y) in Iter.fromArray(Iter.toArray(_userBorrowStatus.entries()))) {
      var tempArray : [(Nat, BorrowerStatus)] = [];
      tempArray := Iter.toArray(y.entries());
      borrowerStatusArray.add(x, tempArray);
    };

    var lenderArray = Buffer.Buffer<(Principal, [(Nat, LenderDetails)])>(0);
    for ((x, y) in Iter.fromArray(Iter.toArray(_lenderDetails.entries()))) {
      var tempArray : [(Nat, LenderDetails)] = [];
      tempArray := Iter.toArray(y.entries());
      lenderArray.add(x, tempArray);
    };

    stableBorrowerLoanDetails := Buffer.toArray<(Principal, [(Nat, BorrowerLoanDetails)])>(borrowerLoanArray);
    stableUserBorrowStatus := Buffer.toArray<(Principal, [(Nat, BorrowerStatus)])>(borrowerStatusArray);
    stableLenderDetails := Buffer.toArray<(Principal, [(Nat, LenderDetails)])>(lenderArray);
    stableBorrowerData := Iter.toArray(_borrowerData.entries());
    stableLenderData := Iter.toArray(_lenderData.entries());
    stableTotalIncomings := Iter.toArray(_totalIncomings.entries());
    stableTotalOutgoings := Iter.toArray(_totalOutgoings.entries());

  };

  system func postupgrade() {

    _borrowerLoanDetails := Map.HashMap<Principal, Map.HashMap<Nat, BorrowerLoanDetails>>(0, Principal.equal, Principal.hash);
    for ((principal, entries) in stableBorrowerLoanDetails.vals()) {
      let innerMap = Map.HashMap<Nat, BorrowerLoanDetails>(0, Nat.equal, natHash);
      for ((nat, details) in entries.vals()) {
        innerMap.put(nat, details);
      };
      _borrowerLoanDetails.put(principal, innerMap);
    };

    _lenderDetails := Map.HashMap<Principal, Map.HashMap<Nat, LenderDetails>>(0, Principal.equal, Principal.hash);
    for ((principal, entries) in stableLenderDetails.vals()) {
      let innerMap = Map.HashMap<Nat, LenderDetails>(0, Nat.equal, natHash);
      for ((nat, details) in entries.vals()) {
        innerMap.put(nat, details);
      };
      _lenderDetails.put(principal, innerMap);
    };

    _userBorrowStatus := Map.HashMap<Principal, Map.HashMap<Nat, BorrowerStatus>>(0, Principal.equal, Principal.hash);
    for ((principal, entries) in stableUserBorrowStatus.vals()) {
      let innerMap = Map.HashMap<Nat, BorrowerStatus>(0, Nat.equal, natHash);
      for ((nat, status) in entries.vals()) {
        innerMap.put(nat, status);
      };
      _userBorrowStatus.put(principal, innerMap);
    };

    _borrowerData := Map.fromIter<Principal, BorrowerData>(stableBorrowerData.vals(), 0, Principal.equal, Principal.hash);
    _lenderData := Map.fromIter<Principal, LenderData>(stableLenderData.vals(), 0, Principal.equal, Principal.hash);
    _totalIncomings := Map.fromIter<Nat, Nat>(stableTotalIncomings.vals(), 0, Nat.equal, natHash);
    _totalOutgoings := Map.fromIter<Nat, Nat>(stableTotalOutgoings.vals(), 0, Nat.equal, natHash);

    stableBorrowerLoanDetails := [];
    stableUserBorrowStatus := [];
    stableLenderDetails := [];
    stableBorrowerData := [];
    stableLenderData := [];
    stableTotalIncomings := [];
    stableTotalOutgoings := [];
  };

};