import React from "react";
import cx from "classnames";

const Card = ({ car }) => {
  return (
    <div
      className={cx("card car", {
        "price-changed text-white bg-success": car.oldPrice > 0
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
      </div>
      <div className="card-footer">
        <small className="text-muted">
          <a
            href={`https://www.gt40.com.br${car.carLink}`}
            className="btn btn-block btn-light stretched-link"
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
