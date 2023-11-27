import React, { useState, useEffect, useContext } from "react";
import moment from "moment/min/moment-with-locales";
import { db, auth } from "../firebase/clientApp";
import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  doc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  getAuth,
  sendPasswordResetEmail,
} from "firebase/auth";
import * as XLSX from "xlsx";
import { sendConfirmationCancel } from "../lib/api";
import { subscribe } from "./Notification";

const AppContext = React.createContext();

moment.locale("pl");
const currentMonthYear = moment().format("MMMM YYYY");
const prevMonthYear = moment().subtract(1, "month").format("MMMM YYYY");

const money = [
  {
    minPeople: 1,
    maxPeople: 3,
    price: 130,
    provision: 35,
  },
  {
    minPeople: 4,
    maxPeople: 8,
    price: 160,
    provision: 50,
  },
];

const AppProvider = ({ children }) => {
  // ARRAYS USESTATE
  const [transfers, setTransfers] = useState([]);
  const [activeTransfers, setActiveTransfers] = useState([]);
  const [next5transfers, setNext5Transfers] = useState([]);
  const [lastAddedTransfers, setLastAddedTransfers] = useState([]);
  const [allUsersList, setAllUsersList] = useState([]);
  const [allUsersTransfers, setAllUsersTransfers] = useState([]);
  const [moneyData, setMoneyData] = useState(money);
  // END ARRAYS USESTATE

  // USER USESTATE
  const [userID, setUserID] = useState("0");
  const [name, setName] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  // END USER USESTATE

  // MONEY USESTATE
  const [monthProvision, setMonthProvision] = useState(0);
  const [monthAdminEarn, setMonthAdminEarn] = useState(0);
  const [monthProvisionAll, setMonthProvisionAll] = useState(0);
  const [monthAdminEarnAll, setMonthAdminEarnAll] = useState(0);
  const [prevMonthProvision, setPrevMonthProvision] = useState(0);
  const [prevMonthAdminEarn, setPrevMonthAdminEarn] = useState(0);
  const [prevMonthProvisionAll, setPrevMonthProvisionAll] = useState(0);
  const [prevMonthAdminEarnAll, setPrevMonthAdminEarnAll] = useState(0);
  // END MONEY USESTATE

  // OTHER USESTATE
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalName, setModalName] = useState(false);
  const [activeHotel, setActiveHotel] = useState(null);
  const [file, setFile] = useState(null);
  const [downloadData, setDownloadData] = useState(null);
  // END OTHER USESTATE
  const [myTag, setMyTag] = useState(null);

  // AUTH
  const getUser = getAuth();

  const createNewUser = async (email, password, newName) => {
    await createUserWithEmailAndPassword(auth, email, password);
    const userRef = doc(db, "usersList", getUser.currentUser.uid);
    await setDoc(
      userRef,
      {
        userName: newName,
        activeAccount: true,
        money: money,
      },
      {
        merge: true,
      }
    );
    logout();
  };

  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
    const getData = doc(db, `usersList/${getUser.currentUser.uid}`);
    const data2 = await getDoc(getData);
    if (data2.data()) {
      const item = data2.data();
      if (item.activeAccount === false) {
        logout();
        alert("Konto zostało usunięte!");
      }
    }
    if (getUser.currentUser.displayName === null) {
      setModalName(true);
    }
  };

  const logout = () => {
    setLoading(true);
    signOut(auth);
    setName("");
    setUserID("0");
    setIsAdmin(false);
    setActiveHotel(false);
    setAllUsersTransfers([]);
    setTransfers([]);
  };

  // UNSUBSCRIBE
  useEffect(async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
    });
    if (currentUser) {
      setUserID(currentUser.uid);
      setName(currentUser.displayName);
      const getData = doc(db, `usersList/${currentUser.uid}`);
      const data2 = await getDoc(getData);
      if (data2.data()) {
        const item = data2.data();
        if (item.activeAccount === false) {
          logout();
          alert("Konto zostało usunięte!");
        }
      }
    }
    if (!currentUser) {
      setLoading(true);
    }
    return unsubscribe;
  }, [currentUser]);
  // END UNSUBSCRIBE

  // END AUTH

  // UPDATE USER
  const updateUser = async (newName) => {
    if (getUser.currentUser.displayName === null) {
      updateName(newName);
      changePassword();
    }
    setModalName(false);
  };

  const updateName = async (newName) => {
    await updateProfile(getUser.currentUser, {
      displayName: newName,
    });
    setName(newName);
    const userRef = doc(db, "usersList", getUser.currentUser.uid);
    setDoc(
      userRef,
      {
        userName: newName,
      },
      {
        merge: true,
      }
    );
  };

  const changePassword = async () => {
    await sendPasswordResetEmail(getUser, getUser.currentUser.email)
      .then(() => {
        // Password reset email sent!
        // ..
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };
  const changePasswordWhenLogin = async (email) => {
    await sendPasswordResetEmail(getUser, email)
      .then(() => {
        // Password reset email sent!
        // ..
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };
  const disableUser = async () => {
    const userRef = doc(db, "usersList", userID);
    await setDoc(
      userRef,
      {
        activeAccount: false,
      },
      {
        merge: true,
      }
    );
  };
  // END UPDATE USER

  // FETCH FROM FIREBASE

  //   GET ALL USERS AND ALL-USERS-TRANSFERS FOR ADMIN
  const getAllUsers = async () => {
    const allUsersCollectionRef = collection(db, "usersList");
    const data = await getDocs(allUsersCollectionRef);
    let items = data.docs.filter((doc) => doc.id !== "0");
    items = items.map((doc) => ({ ...doc.data(), id: doc.id }));

    let backupArray = [];
    items = items.filter((el) => el.activeAccount === true);
    setAllUsersList(items);

    let bigItemsArray = [];
    items.map(async (el) => {
      const allUsersCollectionData = collection(
        db,
        `usersList/${el.id}/transfers`
      );
      onSnapshot(allUsersCollectionData, (snapshot) => {
        const itemsAllUsers = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        const itemsArray = [];
        itemsAllUsers.map((item) => {
          itemsArray.push(item);
        });
        bigItemsArray.push(...itemsArray);
        backupArray.push({
          id: el.id,
          name: el.userName,
          money: el.money,
          itemsArray,
        });
        setDownloadData(backupArray);
        const uniqueitemsArray = [
          ...new Map(bigItemsArray.map((item) => [item["id"], item])).values(),
        ];
        setAllUsersTransfers(uniqueitemsArray);
        updateAdminHomePage(uniqueitemsArray);
        notification(uniqueitemsArray);
      });
    });
  };

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("sw.js")
        .then(function (registration) {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch(function (error) {
          console.error("Service Worker registration failed:", error);
        });
    }
    if ("Notification" in window && "PushManager" in window) {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        }
      });
    }
  }, []);

  // NOTIFICATION NEW TRANSFER
  const notification = async (uniqueitemsArray) => {
    if (uniqueitemsArray.length > 0) {
      const newAddedTransfer = uniqueitemsArray.find((item) => {
        return (
          item.createdDate < Date.now() &&
          item.createdDate > moment().subtract(10, "seconds").valueOf()
        );
      });
      if (
        Notification.permission === "granted" &&
        newAddedTransfer !== undefined
      ) {
        let hotelName = newAddedTransfer.direction.replace(
          "Kraków Airport",
          ""
        );
        hotelName = hotelName.replace(" - ", "").toUpperCase();
        if (isAdmin && newAddedTransfer.status === "pending") {
          // navigator.serviceWorker.ready.then(function (registration) {
          //   registration.showNotification(`${hotelName} dodał transfer`, {
          //     body: `DATA: ${newAddedTransfer.date}, GODZINA: ${newAddedTransfer.time}`,
          //     icon: "logo192.png",
          //     tag: newAddedTransfer.id,
          //     vibrate: [200, 100, 200],
          //   });
          // });
          const title = `${hotelName} dodał transfer`;
          const body = `DATA: ${newAddedTransfer.date}, GODZINA: ${newAddedTransfer.time}`;
          const tag = newAddedTransfer.id;

          await subscribe(title, body, tag);
          if (myTag !== tag) {
            try {
              fetch("api/push");
              setMyTag(tag);
            } catch (error) {
              console.log(error);
            }
          }
        }

        // if (isAdmin && newAddedTransfer.status === "cancel") {
        //   navigator.serviceWorker.ready.then(function (registration) {
        //     registration.showNotification(`${hotelName} anulował transfer`, {
        //       body: `DATA: ${newAddedTransfer.date}, GODZINA: ${newAddedTransfer.time}`,
        //       icon: "logo192.png",
        //       tag: newAddedTransfer.id,
        //       vibrate: [200, 100, 200],
        //     });
        //   });
        // }
        // self.addEventListener("notificationclick", (event) => {
        //   event.notification.close();

        //   // User selected (e.g., clicked in) the main body of notification.
        //   clients.openWindow("https://demo-transfers.vercel.app");
        // });
      }
    }

    // END NOTIFICATION NEW TRANSFER
  };
  const notification2 = (items) => {
    if (items.length > 0) {
      const newAddedTransfer = items.find((item) => {
        return (
          item.createdDate < Date.now() &&
          item.createdDate > moment().subtract(10, "seconds").valueOf()
        );
      });
      if (
        Notification.permission === "granted" &&
        newAddedTransfer !== undefined
      ) {
        if (!isAdmin && newAddedTransfer.status === "ok") {
          navigator.serviceWorker.ready.then(function (registration) {
            registration.showNotification("Potwierdzono transfer!", {
              body: `DATA: ${newAddedTransfer.date}, GODZINA: ${newAddedTransfer.time}`,
              icon: "logo192.png",
              tag: newAddedTransfer.id,
              vibrate: [200, 100, 200],
            });
          });
        }
        self.addEventListener("notificationclick", (event) => {
          event.notification.close();

          // User selected (e.g., clicked in) the main body of notification.
          clients.openWindow("https://demo-transfers.vercel.app");
        });
      }
    }

    // END NOTIFICATION NEW TRANSFER
  };

  // DOWNLOAD DATA
  const exportData = () => {
    if (isAdmin) {
      const wb = XLSX.utils.book_new();
      downloadData.map((item) => {
        const { name, itemsArray } = item;
        if (itemsArray.length > 0) {
          const sortedTransfers = itemsArray.sort((a, b) => {
            let tA = a.time; // hh:mm
            let msA =
              Number(tA.split(":")[0]) * 60 * 60 * 1000 +
              Number(tA.split(":")[1]) * 60 * 1000;
            const firstDate = new Date(a.date).getTime() + msA;
            let tB = b.time; // hh:mm
            let msB =
              Number(tB.split(":")[0]) * 60 * 60 * 1000 +
              Number(tB.split(":")[1]) * 60 * 1000;
            const secondDate = new Date(b.date).getTime() + msB;
            return firstDate - secondDate;
          });

          const newItemsArray = sortedTransfers.map((ob) => {
            const objectOrder = {
              date: null,
              time: null,
              nameOfGuest: null,
              direction: null,
              flight: null,
              people: null,
              phone: null,
              price: null,
              provision: null,
              details: null,
              status: null,
              id: null,
            };
            return Object.assign(objectOrder, ob);
          });
          const sheet1 = XLSX.utils.book_append_sheet(
            wb,
            XLSX.utils.json_to_sheet(newItemsArray),
            name
          );
        }
      });
      XLSX.writeFile(wb, "Transfery.xlsx");

      // JSON
      const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(downloadData)
      )}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = "TransferyBackUp.json";
      link.click();
    }
  };
  // END DOWNLOAD DATA

  // DELETE DATA TO UPDATE
  const deleteData = async () => {
    file.map(async (el) => {
      allUsersTransfers.map(async (item) => {
        const productDoc = doc(db, `usersList/${el.id}/transfers`, item.id);
        await deleteDoc(productDoc);
      });
    });
    getAllUsers();
  };
  // END DELETE DATA TO UPDATE

  // UPLOAD DATA
  const uploadData = async () => {
    file.map(async (el) => {
      const userRef = doc(db, "usersList", el.id);
      await setDoc(userRef, {
        activeAccount: true,
        userName: el.name,
        money: el.money,
      });
      el.itemsArray.map(async (item) => {
        const backupCollection = doc(
          collection(db, `usersList/${el.id}/transfers`)
        );

        await setDoc(backupCollection, {
          id: item.id,
          status: item.status,
          date: item.date,
          time: item.time,
          nameOfGuest: item.nameOfGuest,
          direction: item.direction,
          people: item.people,
          details: item.details,
          flight: item.flight,
          phone: item.phone,
          price: item.price,
          provision: item.provision,
        });
      });
    });
    getAllUsers();
  };
  // END UPLOAD DATA

  useEffect(() => {
    if (currentUser && currentUser.uid === process.env.NEXT_PUBLIC_ADMIN_ID) {
      setIsAdmin(true);
      getAllUsers();
    } else {
      setIsAdmin(false);
    }
  }, [loading, transfers]);

  //   GET ONE USER TRANSFERS
  const getProducts = async () => {
    const getProductsCollectionRefOneUser = collection(
      db,
      `usersList/${userID}/transfers`
    );
    const getMoneyData = doc(db, `usersList/${userID}`);
    const data2 = await getDoc(getMoneyData, "money");
    if (data2.data()) {
      const item = data2.data();
      if (item.money) {
        setMoneyData(item.money);
      } else {
        setMoneyData(money);
      }
    }
    try {
      const data = await getDocs(getProductsCollectionRefOneUser);
      const items = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      if (items.length > 0) {
        setTransfers(items);
      } else {
        setTransfers([]);
      }

      // Jak będzie za dużo strzałów do API to zmienić na to wyżej
      onSnapshot(getProductsCollectionRefOneUser, (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        if (items.length > 0) {
          setTransfers(items);
          // notification2(items);
        } else {
          setTransfers([]);
        }
      });
      //
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      getProducts();
    }
  }, [loading, userID]);

  const updateHotelPrice = () => {
    if (isAdmin) {
      const userRef = doc(db, "usersList", userID);
      setDoc(
        userRef,
        {
          money: moneyData,
        },
        {
          merge: true,
        }
      );
    }
  };

  // END FETCH FROM FIREBASE

  // SORT BY DATE TRANSFERS USER
  useEffect(() => {
    if (transfers.length > 0) {
      const sortedTransfers = transfers.sort((a, b) => {
        let tA = a.time; // hh:mm
        let msA =
          Number(tA.split(":")[0]) * 60 * 60 * 1000 +
          Number(tA.split(":")[1]) * 60 * 1000;
        const firstDate = new Date(a.date).getTime() + msA;
        let tB = b.time; // hh:mm
        let msB =
          Number(tB.split(":")[0]) * 60 * 60 * 1000 +
          Number(tB.split(":")[1]) * 60 * 1000;
        const secondDate = new Date(b.date).getTime() + msB;
        return firstDate - secondDate;
      });
      setTransfers(sortedTransfers);
      setActiveTransfers(transfers.filter((item) => item.status !== "cancel"));
    }
    if (transfers.length === 0) {
      setActiveTransfers([]);
    }
    deleteEverything();
  }, [transfers]);
  //  END SORT BY DATE USER
  //  SORT BY DATE ALL USERS TRANSFERS FOR 24 HOURS FOR ADMIN
  const updateAdminHomePage = (uniqueitemsArray) => {
    if (isAdmin && uniqueitemsArray.length > 0) {
      // SORT
      const sortedTransfers = uniqueitemsArray.sort((a, b) => {
        let tA = a.time; // hh:mm
        let msA =
          Number(tA.split(":")[0]) * 60 * 60 * 1000 +
          Number(tA.split(":")[1]) * 60 * 1000;
        const firstDate = new Date(a.date).getTime() + msA;
        let tB = b.time; // hh:mm
        let msB =
          Number(tB.split(":")[0]) * 60 * 60 * 1000 +
          Number(tB.split(":")[1]) * 60 * 1000;
        const secondDate = new Date(b.date).getTime() + msB;
        return firstDate - secondDate;
      });

      // END SORT

      // NEXT TRANSFERS
      const homePagetransfers = sortedTransfers.filter((item) => {
        let t = item.time; // hh:mm
        let ms =
          Number(t.split(":")[0]) * 60 * 60 * 1000 +
          Number(t.split(":")[1]) * 60 * 1000;
        return moment(item.date).valueOf() + ms > Date.now();
      });
      const adminHomePageTransfers = homePagetransfers.filter((item) => {
        let t = item.time; // hh:mm
        let ms =
          Number(t.split(":")[0]) * 60 * 60 * 1000 +
          Number(t.split(":")[1]) * 60 * 1000;
        return (
          moment(item.date).valueOf() + ms < moment().add(1, "days").valueOf()
        );
      });
      setNext5Transfers(
        adminHomePageTransfers.filter((item) => item.status !== "cancel")
      );
      const lastAdded = homePagetransfers.filter((item) => {
        return item.createdDate > moment().subtract(1, "days").valueOf();
      });
      const lastAdded2 = lastAdded.filter((item) => {
        return item.status !== "cancel";
      });

      setLastAddedTransfers(lastAdded2);
      // END NEXT TRANSFERS
    }
  };

  // END  SORT BY DATE ALL USERS TRANSFERS FOR 24 HOURS FOR ADMIN

  // SUM PROVISION AND NEXT 5 TRANSFERS FOR USER
  useEffect(() => {
    // SUM PROVISION
    if (activeTransfers.length > 0) {
      const okStatusTransfers = activeTransfers.filter(
        (item) => item.status === "ok"
      );
      if (okStatusTransfers.length > 0) {
        const cashArray = okStatusTransfers.map((item) => {
          const newFormatDate = moment(item.date).format("MMMM YYYY");
          return { ...item, date: newFormatDate };
        });
        const cashArray2 = cashArray.filter(
          (item) => item.date === currentMonthYear
        );
        if (cashArray2.length > 0) {
          const provisionSum = cashArray2
            .map((item) => item.provision)
            .reduce((a, b) => a + b);
          setMonthProvision(provisionSum);

          const adminEarn = cashArray2
            .map((item) => item.price)
            .reduce((a, b) => a + b);
          setMonthAdminEarn(adminEarn - provisionSum);
        } else {
          setMonthProvision(0);
          setMonthAdminEarn(0);
        }
        const cashArray3 = cashArray.filter(
          (item) => item.date === prevMonthYear
        );
        if (cashArray3.length > 0) {
          const provisionSum = cashArray3
            .map((item) => item.provision)
            .reduce((a, b) => a + b);
          setPrevMonthProvision(provisionSum);

          const adminEarn = cashArray3
            .map((item) => item.price)
            .reduce((a, b) => a + b);
          setPrevMonthAdminEarn(adminEarn - provisionSum);
        } else {
          setPrevMonthProvision(0);
          setPrevMonthAdminEarn(0);
        }
      } else {
        setPrevMonthProvision(0);
        setPrevMonthAdminEarn(0);
        setMonthProvision(0);
        setMonthAdminEarn(0);
      }
    } else {
      setPrevMonthProvision(0);
      setPrevMonthAdminEarn(0);
      setMonthProvision(0);
      setMonthAdminEarn(0);
    }
    // END SUM PROVISION

    // SUM PROVISION ALL
    if (allUsersTransfers.length > 0) {
      const okStatusTransfers = allUsersTransfers.filter(
        (item) => item.status === "ok"
      );
      if (okStatusTransfers.length > 0) {
        const cashArrayAll = okStatusTransfers.map((item) => {
          const newFormatDate = moment(item.date).format("MMMM YYYY");
          return { ...item, date: newFormatDate };
        });
        const cashArrayAll2W = cashArrayAll.filter(
          (item) => item.date === currentMonthYear
        );
        if (cashArrayAll2W.length > 0) {
          const provisionSumAll = cashArrayAll2W
            .map((item) => item.provision)
            .reduce((a, b) => a + b);
          setMonthProvisionAll(provisionSumAll);
          const adminEarnAll = cashArrayAll2W
            .map((item) => item.price)
            .reduce((a, b) => a + b);
          setMonthAdminEarnAll(adminEarnAll - provisionSumAll);
        } else {
          setMonthProvisionAll(0);
          setMonthAdminEarnAll(0);
        }

        const cashArrayAll3W = cashArrayAll.filter(
          (item) => item.date === prevMonthYear
        );
        if (cashArrayAll3W.length > 0) {
          const provisionSumAll = cashArrayAll3W
            .map((item) => item.provision)
            .reduce((a, b) => a + b);
          setPrevMonthProvisionAll(provisionSumAll);
          const adminEarnAll = cashArrayAll3W
            .map((item) => item.price)
            .reduce((a, b) => a + b);
          setPrevMonthAdminEarnAll(adminEarnAll - provisionSumAll);
        } else {
          setPrevMonthProvisionAll(0);
          setPrevMonthAdminEarnAll(0);
        }
      } else {
        setPrevMonthProvisionAll(0);
        setPrevMonthAdminEarnAll(0);
        setMonthProvisionAll(0);
        setMonthAdminEarnAll(0);
      }
    } else {
      setPrevMonthProvisionAll(0);
      setPrevMonthAdminEarnAll(0);
      setMonthProvisionAll(0);
      setMonthAdminEarnAll(0);
    }
    // END SUM PROVISION ALL
    // NEXT 5 TRANSFERS
    if (!isAdmin && activeTransfers.length > 0) {
      const homePagetransfers = activeTransfers
        .filter((item) => {
          let t = item.time; // hh:mm
          let ms =
            Number(t.split(":")[0]) * 60 * 60 * 1000 +
            Number(t.split(":")[1]) * 60 * 1000;

          return moment(item.date).valueOf() + ms > Date.now();
        })
        .slice(0, 5);
      setNext5Transfers(homePagetransfers);
    }
    // END NEXT 5 TRANSFERS
    if (activeTransfers.length === 0) {
      setMonthProvision(0);
      setMonthAdminEarn(0);
    }
  }, [activeTransfers, userID]);
  // END SUM PROVISION AND NEXT 5 TRANSFERS FOR USER

  // POST TRANSFER TO FIREBASE
  const postProducts = async (
    id,
    status,
    date,
    time,
    nameOfGuest,
    direction,
    people,
    details,
    flight,
    phone,
    price,
    provision,
    createdDate,
    specialTransfer
  ) => {
    const setDocProductsCollectionRef = doc(
      collection(db, `usersList/${userID}/transfers`)
    );
    await setDoc(setDocProductsCollectionRef, {
      id,
      status,
      date,
      time,
      nameOfGuest,
      direction,
      people,
      details,
      flight,
      phone,
      price,
      provision,
      createdDate,
      specialTransfer,
    });
    getProducts();
  };
  // END POST TRANSFER TO FIREBASE

  // EDIT STATUS
  const handleStatus = () => {
    if (confirmDelete) {
      const deletedItem = transfers.find((item) => item.id === deleteId);
      if (isAdmin) {
        deletedItem.status = "ok";
        deletedItem.price = deletedItem.price;
        deletedItem.provision = deletedItem.provision;
        // deletedItem.createdDate = deletedItem.createdDate;
        deletedItem.createdDate = moment().valueOf();
      } else {
        deletedItem.status = "cancel";
        deletedItem.price = 0;
        deletedItem.provision = 0;
        deletedItem.createdDate = moment().valueOf();
        const convertDate = moment(deletedItem.date).format("L");
        const dataNameOfGuest = deletedItem.nameOfGuest;
        const data = { name, convertDate, dataNameOfGuest };
        sendConfirmationCancel(data);
      }
      const activeTransferArray = activeTransfers.filter(
        (item) => item.id !== deleteId
      );
      setActiveTransfers(activeTransferArray);
      putEdit(
        deleteId,
        deletedItem.status,
        deletedItem.price,
        deletedItem.provision,
        deletedItem.createdDate
      );
      setConfirmDelete(false);
    }
  };
  // END EDIT STATUS

  // UPDATE TRANSFER TO FIREBASE
  const putEdit = async (editID, status, price, provision, createdDate) => {
    const productDoc = doc(db, `usersList/${userID}/transfers`, editID);
    const updatedProcuct = {
      status: status,
      price: price,
      provision: provision,
      createdDate: createdDate,
    };
    await updateDoc(productDoc, updatedProcuct);
  };
  // END UPDATE TRANSFER TO FIREBASE

  // DELETE TRANSFERS AFTER 60 DAYS
  const deleteEverything = () => {
    const olderThan60days = transfers.filter((item) => {
      return item.date <= moment().subtract(60, "days").format("YYYY-MM-DD");
    });
    // console.log(olderThan60days);
    if (olderThan60days.length > 0) {
      olderThan60days.forEach((item) => {
        const productDoc = doc(db, `usersList/${userID}/transfers`, item.id);
        deleteDoc(productDoc);
      });
    }
  };
  // END DELETE TRANSFERS AFTER 60 DAYS

  return (
    <AppContext.Provider
      value={{
        isAdmin,
        allUsersList,
        next5transfers,
        transfers,
        name,
        currentUser,
        confirmDelete,
        currentMonthYear,
        prevMonthYear,
        modalName,
        activeHotel,
        loading,
        moneyData,
        monthProvision,
        monthAdminEarn,
        monthAdminEarnAll,
        monthProvisionAll,
        prevMonthProvision,
        prevMonthAdminEarn,
        prevMonthAdminEarnAll,
        prevMonthProvisionAll,
        file,
        lastAddedTransfers,
        setMoneyData,
        setTransfers,
        postProducts,
        setConfirmDelete,
        setDeleteId,
        setLoading,
        handleStatus,
        setActiveHotel,
        setName,
        setUserID,
        logout,
        login,
        updateUser,
        updateName,
        changePassword,
        changePasswordWhenLogin,
        updateHotelPrice,
        createNewUser,
        disableUser,
        getAllUsers,
        exportData,
        uploadData,
        setFile,
        deleteData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
