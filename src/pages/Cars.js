import React, { useEffect, useState } from "react";
import * as firebase from "firebase/app";
import "firebase/database";
import format from 'date-fns/format';
import InfiniteScroll from "react-infinite-scroll-component";

import Card from "../components/Card";
import Loader from "../components/Loader";
import { endpoint } from "../config";
import { STATUS } from "../constants";

export default function Cars() {
  const [firebaseCars, setFirebaseCars] = useState([]);
  const [currentCars, setCurrentCars] = useState([]);
  const [comparedCars, setComparedCars] = useState([]);
  const [paginatedCars, setPaginatedCars] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(0);
  const [status, setStatus] = useState("");
  const [hasMoreScroll, setHasMoreScroll] = useState(true);
  const ref = firebase.database().ref();

  useEffect(() => {
    fetchPersisted();
    fetchGT40Cars();
  }, []);

  useEffect(() => {
    if (firebaseCars.length && currentCars.length) {
      const comparedCars = comparePrices(firebaseCars, currentCars);
      setComparedCars(comparedCars);
    }
  }, [currentCars, firebaseCars]);

  useEffect(() => {
    lazyLoadCars()
  }, [comparedCars]);

  useEffect(() => {
    if (paginatedCars.length > 0 && paginatedCars.length === paginatedCars.length + comparedCars.length) {
      setHasMoreScroll(false);
    }
  }, [comparedCars, paginatedCars]);

  const fetchGT40Cars = async () => {
    console.log("Started fetching GT40");
    setStatus(STATUS.RUNNING);

    const res = await fetch(endpoint, {
      method: "GET"
    });

    res
      .json()
      .then(res => {
        console.log("Finished fetching GT40");
        setCurrentCars(res);
        setStatus(STATUS.SUCCESS);
      })
      .catch(e => {
        console.log(`Fetching from GT40 failed: ${e}`);
        setStatus(STATUS.ERROR);
      });
  };

  const fetchPersisted = () => {
    console.log("Started fetching Firebase");
    setStatus(STATUS.RUNNING);

    ref.on(
      "value",
      function(snapshot) {
        console.log("Finished fetching Firebase");
        setFirebaseCars(snapshot.val().cars);
        setLastUpdate(snapshot.val().updatedAt);
        setStatus(STATUS.SUCCESS);
      },
      function(errorObject) {
        console.log(`Fetching from Firebase failed: ${errorObject.code}`);
        setStatus(STATUS.ERROR);
      }
    );
  };

  const updatePersisted = () => {
    console.log("Started updating Firebase");
    setStatus(STATUS.RUNNING);

    ref.set({
      cars: currentCars,
      updatedAt: Date.now()
    }, function(error) {
      if (error) {
        console.log(`Updating Firebase data failed: ${error}`);
        setStatus(STATUS.ERROR);
      } else {
        console.log("Finished updating Firebase");
        setStatus(STATUS.SUCCESS);
      }
    });
  }

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

  const lazyLoadCars = () => {
    setPaginatedCars([...paginatedCars, ...comparedCars.splice(0, 20)]);
  };

  return (
    <div className="cars">
      <blockquote className="blockquote text-center">
        <p className="mb-0">GT40 list with price check</p>
        {lastUpdate > 0 && <footer className="blockquote-footer">Last updated at {format(parseFloat(lastUpdate, 10), 'DD/MM/YYYY hh:mm')}</footer>}
        {currentCars.length > 0 && <button type="button" className="btn btn-primary mt-2" onClick={() => updatePersisted()}>Update Firebase</button>}
      </blockquote>
      <InfiniteScroll
          dataLength={paginatedCars.length}
          endMessage={<p className="text-center">-- Showing all {paginatedCars.length} cars -- </p>}
          hasMore={hasMoreScroll}
          loader={<Loader status={status} />}
          next={lazyLoadCars}
        >
        <div className="car__list">
          {paginatedCars.map(car => (
            <Card key={`${car.modelId}${car.adsID}`} car={car} />
          ))}
        </div>
        </InfiniteScroll>
    </div>
  );
}
