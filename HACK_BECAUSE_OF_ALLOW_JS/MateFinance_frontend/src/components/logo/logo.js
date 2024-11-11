import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';
import { RouterLink } from 'src/routes/components';
// ----------------------------------------------------------------------
const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
    const theme = useTheme();
    const PRIMARY_LIGHT = theme.palette.primary.light;
    const PRIMARY_MAIN = theme.palette.primary.main;
    const PRIMARY_DARK = theme.palette.primary.dark;
    // OR using local (public folder)
    // -------------------------------------------------------
    const logo = (<Box component="img" src="/logo/logo_main.svg" sx={{ width: 180, cursor: 'pointer', ...sx }}/>);
    // const logo = (
    //   <Box
    //     ref={ref}
    //     component="div"
    //     sx={{
    //       width: 40,
    //       height: 40,
    //       display: 'inline-flex',
    //       ...sx,
    //     }}
    //     {...other}
    //   >
    //     <svg
    //       version="1.1"
    //       xmlns="http://www.w3.org/2000/svg"
    //       xmlnsXlink="http://www.w3.org/1999/xlink"
    //       x="0px"
    //       y="0px"
    //       viewBox="0 0 1080 1080"
    //       style={{ enableBackground: 'new 0 0 1080 1080' }}
    //       xmlSpace="preserve"
    //     >
    //       <style type="text/css">
    //         {`
    //       .Drop_x0020_Shadow { fill: none; }
    //       .Thick_x0020_Blue_x0020_Neon { fill: none; stroke: #0073BC; stroke-width: 10; stroke-linecap: round; stroke-linejoin: round; }
    //       .Illuminating_x0020_Aqua { fill: url(#SVGID_1_); stroke: #FFFFFF; stroke-width: 0.25; stroke-miterlimit: 1; }
    //       .Black_x0020_Highlight { fill: url(#SVGID_00000181789069010899429160000009461301467733873314_); stroke: #FFFFFF; stroke-width: 0.3629; stroke-miterlimit: 1; }
    //       .Bugaboo_GS { fill-rule: evenodd; clip-rule: evenodd; fill: #FFDD00; }
    //       .st0 { fill: url(#SVGID_00000021805692779278422640000010871010523646275761_); }
    //       .st1 { fill: url(#SVGID_00000026137624108108854500000005682159188386059648_); }
    //       .st2 { fill: url(#SVGID_00000127033585688944898400000011778122177163756203_); }
    //       .st3 { fill: url(#SVGID_00000000929195547106827140000004690686535419731861_); }
    //       .st4 { fill: url(#SVGID_00000101812051178147497530000015337101883367342265_); }
    //       .st5 { fill: url(#SVGID_00000094611610787766790100000011129183778680428716_); }
    //       .st6 { fill: #5A2C66; }
    //       .st7 { fill: #9E2654; }
    //     `}
    //       </style>
    //       <linearGradient
    //         id="SVGID_1_"
    //         gradientUnits="userSpaceOnUse"
    //         x1="0"
    //         y1="0"
    //         x2="6.123234e-17"
    //         y2="-1"
    //       >
    //         <stop offset="0" style={{ stopColor: '#1D59F4' }} />
    //         <stop offset="0.618" style={{ stopColor: '#2D65EE' }} />
    //         <stop offset="0.6292" style={{ stopColor: '#3864F3' }} />
    //         <stop offset="0.9831" style={{ stopColor: '#00DDFC' }} />
    //       </linearGradient>
    //       <linearGradient
    //         id="SVGID_00000092421508446770591190000009539679470025139095_"
    //         gradientUnits="userSpaceOnUse"
    //         x1="0"
    //         y1="0"
    //         x2="6.123234e-17"
    //         y2="-1"
    //       >
    //         <stop offset="0" style={{ stopColor: '#060606' }} />
    //         <stop offset="0.618" style={{ stopColor: '#000000' }} />
    //         <stop offset="0.6292" style={{ stopColor: '#000000' }} />
    //         <stop offset="0.9831" style={{ stopColor: '#000000' }} />
    //       </linearGradient>
    //       <linearGradient
    //         id="SVGID_00000101063027745240209500000015813041922475251088_"
    //         gradientUnits="userSpaceOnUse"
    //         x1="383.6552"
    //         y1="682.4716"
    //         x2="695.8306"
    //         y2="141.7679"
    //         gradientTransform="matrix(0.999 -4.468844e-02 4.468844e-02 0.999 -19.1016 34.7125)"
    //       >
    //         <stop offset="1.491781e-07" style={{ stopColor: '#9E2654' }} />
    //         <stop offset="1" style={{ stopColor: '#5A2C66' }} />
    //       </linearGradient>
    //       <linearGradient
    //         id="SVGID_00000006709309743529607030000003912253791132656258_"
    //         gradientUnits="userSpaceOnUse"
    //         x1="361.9488"
    //         y1="665.7253"
    //         x2="576.4731"
    //         y2="145.5769"
    //         gradientTransform="matrix(0.999 -4.468844e-02 4.468844e-02 0.999 -19.1016 34.7125)"
    //       >
    //         <stop offset="1.491781e-07" style={{ stopColor: '#9E2654' }} />
    //         <stop offset="1" style={{ stopColor: '#5A2C66' }} />
    //       </linearGradient>
    //       <linearGradient
    //         id="SVGID_00000025498955611190025210000000554640687098106527_"
    //         gradientUnits="userSpaceOnUse"
    //         x1="368.5635"
    //         y1="668.5433"
    //         x2="600.1819"
    //         y2="127.7616"
    //         gradientTransform="matrix(0.999 -4.468844e-02 4.468844e-02 0.999 -19.1016 34.7125)"
    //       >
    //         <stop offset="1.491781e-07" style={{ stopColor: '#9E2654' }} />
    //         <stop offset="1" style={{ stopColor: '#5A2C66' }} />
    //       </linearGradient>
    //       <linearGradient
    //         id="SVGID_00000003284883222717963230000004809268649620984040_"
    //         gradientUnits="userSpaceOnUse"
    //         x1="376.6555"
    //         y1="658.543"
    //         x2="631.1465"
    //         y2="117.7178"
    //         gradientTransform="matrix(0.999 -4.468844e-02 4.468844e-02 0.999 -19.1016 34.7125)"
    //       >
    //         <stop offset="1.491781e-07" style={{ stopColor: '#9E2654' }} />
    //         <stop offset="1" style={{ stopColor: '#5A2C66' }} />
    //       </linearGradient>
    //       <linearGradient
    //         id="SVGID_00000052428593711309285330000010734445628413290789_"
    //         gradientUnits="userSpaceOnUse"
    //         x1="432.2844"
    //         y1="740.4567"
    //         x2="555.6752"
    //         y2="89.1524"
    //         gradientTransform="matrix(0.999 -4.468844e-02 4.468844e-02 0.999 -19.1016 34.7125)"
    //       >
    //         <stop offset="1.491781e-07" style={{ stopColor: '#9E2654' }} />
    //         <stop offset="1" style={{ stopColor: '#5A2C66' }} />
    //       </linearGradient>
    //       <linearGradient
    //         id="SVGID_00000052272204518379951840000001333739616036175834_"
    //         gradientUnits="userSpaceOnUse"
    //         x1="424.3789"
    //         y1="726.5308"
    //         x2="555.9088"
    //         y2="79.1338"
    //         gradientTransform="matrix(0.999 -4.468844e-02 4.468844e-02 0.999 -19.1016 34.7125)"
    //       >
    //         <stop offset="1.491781e-07" style={{ stopColor: '#9E2654' }} />
    //         <stop offset="1" style={{ stopColor: '#5A2C66' }} />
    //       </linearGradient>
    //       <linearGradient
    //         id="SVGID_00000021805692779278422640000010871010523646275761_"
    //         gradientUnits="userSpaceOnUse"
    //         x1="417.9509"
    //         y1="713.1431"
    //         x2="554.1707"
    //         y2="69.3487"
    //         gradientTransform="matrix(0.999 -4.468844e-02 4.468844e-02 0.999 -19.1016 34.7125)"
    //       >
    //         <stop offset="1.491781e-07" style={{ stopColor: '#9E2654' }} />
    //         <stop offset="1" style={{ stopColor: '#5A2C66' }} />
    //       </linearGradient>
    //       <linearGradient
    //         id="SVGID_00000026137624108108854500000005682159188386059648_"
    //         gradientUnits="userSpaceOnUse"
    //         x1="407.4183"
    //         y1="695.8731"
    //         x2="553.2526"
    //         y2="59.0989"
    //         gradientTransform="matrix(0.999 -4.468844e-02 4.468844e-02 0.999 -19.1016 34.7125)"
    //       >
    //         <stop offset="1.491781e-07" style={{ stopColor: '#9E2654' }} />
    //         <stop offset="1" style={{ stopColor: '#5A2C66' }} />
    //       </linearGradient>
    //       <linearGradient
    //         id="SVGID_00000127033585688944898400000011778122177163756203_"
    //         gradientUnits="userSpaceOnUse"
    //         x1="409.7737"
    //         y1="698.8461"
    //         x2="564.029"
    //         y2="45.9433"
    //         gradientTransform="matrix(0.999 -4.468844e-02 4.468844e-02 0.999 -19.1016 34.7125)"
    //       >
    //         <stop offset="1.491781e-07" style={{ stopColor: '#9E2654' }} />
    //         <stop offset="1" style={{ stopColor: '#5A2C66' }} />
    //       </linearGradient>
    //       <linearGradient
    //         id="SVGID_00000000929195547106827140000004690686535419731861_"
    //         gradientUnits="userSpaceOnUse"
    //         x1="404.6813"
    //         y1="700.6798"
    //         x2="556.8114"
    //         y2="52.2243"
    //         gradientTransform="matrix(0.999 -4.468844e-02 4.468844e-02 0.999 -19.1016 34.7125)"
    //       >
    //         <stop offset="1.491781e-07" style={{ stopColor: '#9E2654' }} />
    //         <stop offset="1" style={{ stopColor: '#5A2C66' }} />
    //       </linearGradient>
    //       <linearGradient
    //         id="SVGID_00000101812051178147497530000015337101883367342265_"
    //         gradientUnits="userSpaceOnUse"
    //         x1="406.1701"
    //         y1="696.812"
    //         x2="553.4993"
    //         y2="58.1401"
    //         gradientTransform="matrix(0.999 -4.468844e-02 4.468844e-02 0.999 -19.1016 34.7125)"
    //       >
    //         <stop offset="1.491781e-07" style={{ stopColor: '#9E2654' }} />
    //         <stop offset="1" style={{ stopColor: '#5A2C66' }} />
    //       </linearGradient>
    //       <linearGradient
    //         id="SVGID_00000094611610787766790100000011129183778680428716_"
    //         gradientUnits="userSpaceOnUse"
    //         x1="405.635"
    //         y1="698.2599"
    //         x2="556.9791"
    //         y2="51.2201"
    //         gradientTransform="matrix(0.999 -4.468844e-02 4.468844e-02 0.999 -19.1016 34.7125)"
    //       >
    //         <stop offset="1.491781e-07" style={{ stopColor: '#9E2654' }} />
    //         <stop offset="1" style={{ stopColor: '#5A2C66' }} />
    //       </linearGradient>
    //       <linearGradient
    //         id="SVGID_00000092421508446770591190000009539679470025139095_"
    //         gradientUnits="userSpaceOnUse"
    //         x1="414.104"
    //         y1="708.2449"
    //         x2="556.8845"
    //         y2="57.2113"
    //         gradientTransform="matrix(0.999 -4.468844e-02 4.468844e-02 0.999 -19.1016 34.7125)"
    //       >
    //         <stop offset="1.491781e-07" style={{ stopColor: '#9E2654' }} />
    //         <stop offset="1" style={{ stopColor: '#5A2C66' }} />
    //       </linearGradient>
    //       <linearGradient
    //         id="SVGID_00000092421508446770591190000009539679470025139095_"
    //         gradientUnits="userSpaceOnUse"
    //         x1="414.104"
    //         y1="708.2449"
    //         x2="556.8845"
    //         y2="57.2113"
    //         gradientTransform="matrix(0.999 -4.468844e-02 4.468844e-02 0.999 -19.1016 34.7125)"
    //       >
    //         <stop offset="1.491781e-07" style={{ stopColor: '#9E2654' }} />
    //         <stop offset="1" style={{ stopColor: '#5A2C66' }} />
    //       </linearGradient>
    //       <radialGradient
    //         id="SVGID_00000092421508446770591190000009539679470025139095_"
    //         cx="64.9321"
    //         cy="1119.0836"
    //         r="155.8886"
    //         gradientTransform="matrix(1 0 0 0.732 -42.1426 -85.2111)"
    //         gradientUnits="userSpaceOnUse"
    //       >
    //         <stop offset="0" style={{ stopColor: '#FFFFFF' }} />
    //         <stop offset="0.3456" style={{ stopColor: '#E4E4E4' }} />
    //         <stop offset="0.5757" style={{ stopColor: '#CBCBCB' }} />
    //         <stop offset="0.7738" style={{ stopColor: '#B5B5B5' }} />
    //         <stop offset="0.9494" style={{ stopColor: '#A5A5A5' }} />
    //         <stop offset="1" style={{ stopColor: '#A1A1A1' }} />
    //       </radialGradient>
    //       <radialGradient
    //         id="SVGID_00000092421508446770591190000009539679470025139095_"
    //         cx="64.9321"
    //         cy="1119.0836"
    //         r="155.8886"
    //         gradientTransform="matrix(1 0 0 0.732 -42.1426 -85.2111)"
    //         gradientUnits="userSpaceOnUse"
    //       >
    //         <stop offset="0" style={{ stopColor: '#FFFFFF' }} />
    //         <stop offset="0.3456" style={{ stopColor: '#E4E4E4' }} />
    //         <stop offset="0.5757" style={{ stopColor: '#CBCBCB' }} />
    //         <stop offset="0.7738" style={{ stopColor: '#B5B5B5' }} />
    //         <stop offset="0.9494" style={{ stopColor: '#A5A5A5' }} />
    //         <stop offset="1" style={{ stopColor: '#A1A1A1' }} />
    //       </radialGradient>
    //       <g className="Drop_x0020_Shadow">
    //         <path
    //           className="Thick_x0020_Blue_x0020_Neon"
    //           d="M315.4,614.7c0,0,29.3,87.4,117.1,117.1c87.8,29.7,206.2,28.3,206.2,28.3s45.8-80.2,32.2-169.6
    //       c-13.6-89.4-97.7-188.9-181.7-170.8C405.1,435.1,315.4,614.7,315.4,614.7z"
    //         />
    //         <path
    //           className="Thick_x0020_Blue_x0020_Neon"
    //           d="M392.1,426.5c-2.8-0.4-5.4-1.9-6.8-4.4c-1.3-2.5-0.9-5.6,1-7.5c0,0,9.4-10.2,29.8-14.1
    //       c20.5-4,52.5-0.7,86.4,14.2c33.9,14.9,67.1,38.5,67.1,38.5s-13.5,20.2-37.4,23.3c-23.9,3.1-67.7-3.9-103.2-21.9
    //       C422.5,432.9,403.1,428.5,392.1,426.5z"
    //         />
    //         <path
    //           className="Thick_x0020_Blue_x0020_Neon"
    //           d="M608.8,311.5c0,0-50.1-6.2-99.6,3.2c-49.4,9.4-92.5,32.8-109.7,56.7
    //       c-17.1,23.9-4.8,37.5,19.1,43.9c23.9,6.4,69.4,13.5,114.6,2.2c45.2-11.3,87-39.2,107.4-58.1C635.7,329.9,608.8,311.5,608.8,311.5
    //       z"
    //         />
    //         <path
    //           className="Thick_x0020_Blue_x0020_Neon"
    //           d="M672.4,407.2c-2.5,0.8-5.3,0.3-7.3-1.4c-2-1.7-3.1-4.4-2.7-7c0,0,5.4-25.3,9.1-56.5
    //       c3.7-31.3,2.1-68.7-4.5-102.7c-6.6-34-17.7-61.5-17.7-61.5s-23.7-1.4-37.9,12.7c-14.3,14.1-26.6,44.5-29.6,79
    //       c-3,34.5,2.3,77.5,9.5,116.1C616.7,348.6,664.9,404.4,672.4,407.2z"
    //         />
    //         <path
    //           className="Thick_x0020_Blue_x0020_Neon"
    //           d="M414.2,352.9c0,0-52.3-7-88.8,8.4c-36.5,15.4-61,46.1-68.8,79.7c-7.9,33.6-3.6,62.1,13.1,77.9
    //       c16.7,15.8,44.9,12.5,76.4-0.7c31.6-13.3,59.1-35.3,71.1-53.1C438.9,427.8,414.2,352.9,414.2,352.9z"
    //         />
    //       </g>
    //       <g className="Illuminating_x0020_Aqua">
    //         <path
    //           className="Black_x0020_Highlight"
    //           d="M732.5,772.6c0,0-10.5,35.5-30.6,43.3c-20.1,7.8-38.7-2.2-38.7-2.2s12.1-24.8,19.6-42.6
    //       c7.5-17.8,7.3-25.6,19.1-33.8C713.9,717,730.8,736.3,732.5,772.6z"
    //         />
    //         <path
    //           className="Black_x0020_Highlight"
    //           d="M812.2,745.1c0,0-25.2-9.6-54.5,3.3c-29.3,12.8-43.6,41.6-43.6,41.6s15.1,19,29.1,11.5
    //       c14-7.5,35.8-30.4,50.2-35.8C790.6,750.3,812.2,745.1,812.2,745.1z"
    //         />
    //         <path
    //           className="Black_x0020_Highlight"
    //           d="M704.6,714.4c0,0-15.9,25.6-26.2,52.2c-10.4,26.6-8.3,48.9-8.3,48.9s26.2-12.6,39.3-28.1
    //       c13.1-15.5,14.2-24.4,18.2-45.4C731.6,720.2,704.6,714.4,704.6,714.4z"
    //         />
    //         <path
    //           className="Black_x0020_Highlight"
    //           d="M649.2,751.6c0,0-11.4,28.2-14.6,55c-3.2,26.8,3.5,51.5,3.5,51.5s25.7-10.4,38-21.4
    //       c12.3-11,15.2-16.1,23.4-38.1C694,760.2,649.2,751.6,649.2,751.6z"
    //         />
    //         <path
    //           className="Black_x0020_Highlight"
    //           d="M736.7,832.1c0,0-23.6,15.6-36.3,33.8c-12.7,18.2-11.7,35.6-11.7,35.6s20.4-1.7,36.9-8.8
    //       c16.5-7.1,26.5-8.5,45.8-23.3C772.3,860.5,736.7,832.1,736.7,832.1z"
    //         />
    //       </g>
    //       <g className="Bugaboo_GS">
    //         <path
    //           className="st0"
    //           d="M765.3,728.4c0,0-3.1-13.6-18.4-8.8c-15.3,4.8-3.5,25.2-3.5,25.2s17.8-7.4,19.3-12.4
    //       C763.9,730.2,765.3,728.4,765.3,728.4z"
    //         />
    //         <path
    //           className="st1"
    //           d="M775.6,747.2c0,0-10.8-3.4-16.2,1.4c-5.4,4.8-3.3,15.3-3.3,15.3s12.2-6.5,15.2-10.3
    //       C775.6,752.4,775.6,747.2,775.6,747.2z"
    //         />
    //         <path
    //           className="st2"
    //           d="M775.1,774.9c0,0-3.5,7.7-14.2,6.2c-10.7-1.5,2.4-14.1,2.4-14.1s11.8,2.4,14.5,5.2
    //       C775.9,771.3,775.1,774.9,775.1,774.9z"
    //         />
    //         <path
    //           className="st3"
    //           d="M750.5,778.8c0,0,2.7-10.6-2.8-14.5c-5.5-3.9-15.2,0.2-15.2,0.2s-2.4,14,0.4,15.8
    //       C736.9,781.7,750.5,778.8,750.5,778.8z"
    //         />
    //         <path
    //           className="st4"
    //           d="M726.3,760.3c0,0,11.7-1.3,11.8-10.2c0.1-8.9-12.2-7.7-12.2-7.7s-6.2,11.5-3.1,14.5
    //       C723.1,759.7,726.3,760.3,726.3,760.3z"
    //         />
    //         <path
    //           className="st5"
    //           d="M731.4,733.7c0,0,10.2,3.9,11.6-5.6c1.4-9.6-12.3-9.7-12.3-9.7s-7.1,10.6-5.6,12.3
    //       C725.2,733.2,731.4,733.7,731.4,733.7z"
    //         />
    //         <path
    //           className="st6"
    //           d="M764.3,735.7c0,0-0.1-4.4-4.1-5.2c-4-0.8-1.1,5-1.1,5s1.8,0.2,3.1,0.6C762.2,736.7,764.3,735.7,764.3,735.7z"
    //         />
    //         <path
    //           className="st7"
    //           d="M759.5,753.5c0,0-0.8-2.8-3.2-3.4c-2.5-0.6-0.6,4.2-0.6,4.2s0.7,0.3,1.8,0.6
    //       C757.6,754.9,759.5,753.5,759.5,753.5z"
    //         />
    //         <path
    //           className="st6"
    //           d="M745.9,745.9c0,0-0.7-3.1-3.2-3.4c-2.5-0.3-1.1,4.4-1.1,4.4s1,0.3,2.1,0.8
    //       C744.2,747.3,745.9,745.9,745.9,745.9z"
    //         />
    //         <path
    //           className="st1"
    //           d="M753.8,768.1c0,0-2.3-4.6-6-4.2c-3.7,0.4-1.3,6.4-1.3,6.4s1.3,0.2,2.4,0.5
    //       C751.3,770.1,753.8,768.1,753.8,768.1z"
    //         />
    //         <path
    //           className="st0"
    //           d="M741.6,756.8c0,0-3.8-2.7-6.9-2.1c-3.1,0.7-0.9,4.6-0.9,4.6s0.9,0.2,1.6,0.5
    //       C739.1,759.1,741.6,756.8,741.6,756.8z"
    //         />
    //         <path
    //           className="st5"
    //           d="M768.5,740.5c0,0-2.3-2.6-6.3-2.4c-4,0.2-1.1,4.3-1.1,4.3s1.3,0.1,2.4,0.3
    //       C765.3,742.7,768.5,740.5,768.5,740.5z"
    //         />
    //       </g>
    //     </svg>
    //   </Box>
    // );
    if (disabledLink) {
        return logo;
    }
    return (<Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
      {logo}
    </Link>);
});
Logo.propTypes = {
    disabledLink: PropTypes.bool,
    sx: PropTypes.object,
};
export default Logo;
