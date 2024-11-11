import { Box, Stack } from '@mui/material';
import FinanceProfileDocumentTable from 'src/sections/financing/table/Documents/finance-profile-document-table';
import UAEBasicKycQuestionAnswer from './components/uae-user-basic-kyc-question-answers';
import UAEBusinessClientQuestionAnswer from './components/uae-user-business-client-question-answer';
import UAEUserKeypersonOne from './components/uae-user-keyperson-1';
import UAEUserKeypersonTwo from './components/uae-user-keyperson-2';
import UserAccountInformation from './components/user-Account-Information';
import UserBiometricVerification from './components/user-biometiric-vetrification';
import UserBusinessInformation from './components/user-business-information';
import UserCnicInformation from './components/user-cnic-information';
import UserFilerDetail from './components/user-filer-details';
import UserGuarantorDetails from './components/user-guarantor-details';
import UserPostDatedCheque from './components/user-post-dated-cheque';
import HoldingCompanyDetails from './components/holding-company-details';
import UserMonthlyBankStatement from './components/monthly-bank-statement';
import AdvanceKYC from './components/advance-kyc';
export default function FinancialDetailsTab({ financialDetail, userDetail, openCommentModalHandler, handleShowFilerDetail, creditScoreCriteriaList, }) {
    return (<Stack spacing={3}>
      {financialDetail?.advanceKyc && financialDetail.advanceKyc.length > 0 ? (<Box>
          <AdvanceKYC financialDetail={financialDetail}/>
        </Box>) : ('')}

      <Box>
        <UserCnicInformation financialDetail={financialDetail}/>
      </Box>
      <Box>
        <UserMonthlyBankStatement financialDetail={financialDetail}/>
      </Box>
      {userDetail?.geoLocation?.currencyCode === 'AED' ? ('') : (<Box>
          <UserBusinessInformation financialDetail={financialDetail} openCommentModalHandler={openCommentModalHandler} userDetail={userDetail} creditScoreCriteriaList={creditScoreCriteriaList}/>
        </Box>)}
      <Box>
        <UserGuarantorDetails financialDetail={financialDetail} openCommentModalHandler={openCommentModalHandler}/>
      </Box>
      {userDetail?.geoLocation?.currencyCode === 'AED' ? (<Box>
          <UAEUserKeypersonOne user={userDetail}/>
        </Box>) : ('')}
      {financialDetail?.keyPerson2?.dateOfBirth === null &&
            financialDetail?.keyPerson2?.fullName === '' ? ('') : (<>
          {userDetail?.geoLocation?.currencyCode === 'AED' ? (<Box>
              <UAEUserKeypersonTwo user={userDetail}/>
            </Box>) : ('')}
        </>)}

      <Box>
        <HoldingCompanyDetails financialDetail={userDetail}/>
      </Box>

      {userDetail?.geoLocation?.currencyCode === 'AED' ? (<Box>
          <UAEBasicKycQuestionAnswer user={userDetail}/>
        </Box>) : ('')}

      {userDetail?.geoLocation?.currencyCode === 'AED' ? (<Box>
          <UAEBusinessClientQuestionAnswer user={userDetail}/>
        </Box>) : ('')}
      {userDetail?.geoLocation?.currencyCode === 'AED' ? ('') : (<Box>
          <UserAccountInformation financialDetail={userDetail}/>
        </Box>)}
      <Box>
        <FinanceProfileDocumentTable documents={financialDetail?.documents} userDetail={userDetail}/>
      </Box>

      {/* <Box>
          <UserBiometricVerification
            financialDetail={financialDetail}
            openCommentModalHandler={openCommentModalHandler}
          />
        </Box> */}
      {/* <Box>
          <UserFilerDetail
            financialDetail={financialDetail}
            openCommentModalHandler={openCommentModalHandler}
            handleShowFilerDetail={handleShowFilerDetail}
          />
        </Box> */}
      {/* <Box>
          <UserPostDatedCheque
            financialDetail={financialDetail}
            openCommentModalHandler={openCommentModalHandler}
            handleShowFilerDetail={handleShowFilerDetail}
          />
        </Box> */}
    </Stack>);
}
