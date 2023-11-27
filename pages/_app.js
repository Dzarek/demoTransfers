import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Head from "next/head";
import { AppProvider } from "../components/context";
import Layout from "../components/Layout";
import { appInfoCompany } from "../companyInfo/CompanyInfo";
// import Notifications from "../components/notify";

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
            {/* <Notifications /> */}
            <Navbar />
            <Component {...pageProps} />
            <Footer />
          </Layout>
        </div>
      </AppProvider>
    </>
  );
}

export default MyApp;
