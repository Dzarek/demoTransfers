import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Head from "next/head";
import { AppProvider } from "../components/context";
import Layout from "../components/Layout";
import { appInfoCompany } from "../companyInfo/CompanyInfo";
// import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  // NOTIFICATION
  // useEffect(() => {
  //   if ("serviceWorker" in navigator) {
  //     navigator.serviceWorker
  //       .register("sw.js")
  //       .then(function (registration) {
  //         console.log(
  //           "Service Worker registered with scope:",
  //           registration.scope
  //         );
  //       })
  //       .catch(function (error) {
  //         console.error("Service Worker registration failed:", error);
  //       });
  //   }
  //   if ("Notification" in window && "PushManager" in window) {
  //     Notification.requestPermission().then(function (permission) {
  //       if (permission === "granted") {
  //         console.log("Notification permission granted.");
  //       }
  //     });
  //   }
  // }, []);

  // END NOTIFICATION

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
