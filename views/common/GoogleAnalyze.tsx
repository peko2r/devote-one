// import Script from 'next/script'
// import { GaId } from '@/utils/env'

// export default function GoogleAnalyze(props: { id: string }) {
//   return (
//     <>
//       <Script async src={`https://www.googletagmanager.com/gtag/js?id=${props.id}`}></Script>
//       <Script id={'google-analytics'} strategy={'afterInteractive'}>
//         {`window.dataLayer = window.dataLayer || [];
//             function gtag(){dataLayer.push(arguments);}
//             gtag("js", new Date());

//             gtag("config", "${props.id}");`}
//       </Script>
//     </>
//   )
// }
