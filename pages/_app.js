import "../styles/globals.css";
import Head from "next/head";
import { AppProvider } from "../components/context";
import Layout from "../components/Layout";
import { appInfoCompany } from "../companyInfo/CompanyInfo";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>{appInfoCompany}</title>
        <meta name="description" content={appInfoCompany} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <link rel="shortcut icon" href="/logo192.png" />
      </Head>
      <AppProvider>
        <div className="app">
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </div>
      </AppProvider>
    </>
  );
}

export default MyApp;
