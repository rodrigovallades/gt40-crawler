import React, { useEffect, useState } from "react";
import * as firebase from "firebase/app";
import "firebase/database";

import Card from "../components/Card";
import Loader from "../components/Loader";
import { endpoint } from "../config";
import { STATUS } from "../constants";

export default function Cars() {
  const [firebaseCars, setFirebaseCars] = useState([]);
  const [currentCars, setCurrentCars] = useState([]);
  const [comparedCars, setComparedCars] = useState([]);
  const [status, setStatus] = useState("");
  const ref = firebase.database().ref("cars");

  useEffect(() => {
    fetchPersisted();
  }, []);

  useEffect(() => {
    if (firebaseCars.length && currentCars.length) {
      const comparedCars = comparePrices(firebaseCars, currentCars);
      setComparedCars(comparedCars);
    }
  }, [currentCars, firebaseCars]);

  useEffect(() => {
    if (firebaseCars.length) {
      fetchGT40Cars();
    }
  }, [firebaseCars]);

  const fetchGT40Cars = async () => {
    console.log("started fetching gt40");
    setStatus(STATUS.RUNNING);
    const res = await fetch(endpoint, {
      method: "GET"
    });

    res
      .json()
      .then(res => {
        console.log("finished fetching gt40");
        setCurrentCars(res);
        setStatus(STATUS.SUCCESS);
      })
      .catch(e => {
        console.log(`Fetching from GT40 failed: ${e}`);
        setStatus(STATUS.ERROR);
      });
  };

  const fetchPersisted = () => {
    console.log("started fetching firebase");
    setStatus(STATUS.RUNNING);
    ref.on(
      "value",
      function(snapshot) {
        console.log("finished fetching firebase");
        setFirebaseCars(snapshot.val());
        setStatus(STATUS.SUCCESS);
      },
      function(errorObject) {
        console.log(`Fetching from Firebase failed: ${errorObject.code}`);
        setStatus(STATUS.ERROR);
      }
    );
  };

  const comparePrices = (a1, a2) => {
    const compared = a1.map(a => {
      let match = a2.filter(b => a.adsID === b.adsID)[0] || a;
      match.oldPrice = a.price !== match.price ? a.price : 0;
      return match;
    });

    return compared.sort((a, b) =>
      a.oldPrice < b.oldPrice ? 1 : b.oldPrice < a.oldPrice ? -1 : 0
    );
  };

  if (status === STATUS.ERROR) {
    return (
      <div className="app__error">An error occured while fetching. :(</div>
    );
  }

  return (
    <div className="cars">
      <Loader status={status} />
      <h1 className="text-center">GT40 list with price check</h1>
      <div className="car__list">
        {comparedCars.map(car => (
          <Card key={`${car.modelId}${car.adsID}`} car={car} />
        ))}
      </div>
    </div>
  );
}
