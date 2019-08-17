import React from "react";
import cx from "classnames";

const Card = ({ car }) => {
  const { REACT_APP_DEBUG: debug } = process.env;

  return (
    <div
      className={cx("card car", {
        "price-changed text-white bg-success": car.oldPrice > 0 && car.oldPrice > car.price,
        "price-changed text-white bg-danger": car.oldPrice > 0 && car.oldPrice < car.price,
      })}
    >
      <img
        className="card-img-top"
        src={car.image}
        alt={`${car.modelName} ${car.modelDetails}`}
      />
      <div className="card-body">
        <h5 className="card-title">{car.modelName}</h5>
        <p className="card-text car__price">R$ {car.price}</p>
        {car.oldPrice > 0 && (
          <p className="card-text car__price car__price--old">
            R$ {car.oldPrice}
          </p>
        )}
        <p className="card-text">{car.id}</p>
        {debug && (
          <pre>{JSON.stringify(car, null, 2)}</pre>
        )}
      </div>
      <div className="card-footer">
        <small className="text-muted">
          <a
            href={`https://www.gt40.com.br${car.carLink}`}
            className={cx("btn btn-block btn-light", {
              "stretched-link": !debug,
            })}
            target="_blank"
          >
            Open details
          </a>
        </small>
      </div>
    </div>
  );
};

export default Card;
