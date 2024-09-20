import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPalButton = () => {
  const initialOptions = {
    "client-id": "ASHnGnZhPSBBCLPqKuNPN53aue0gJZ8P5Scj-n5BaLPIgtgt4SIH91Aij_eJJCoxsmqTHKRdqNf4xLcg",
    currency: "EUR",
    intent: "capture",
  };

  // Состояние для выбранной суммы
  const [amount, setAmount] = useState(500); // по умолчанию 500
  const [key, setKey] = useState(0); // Ключ для обновления PayPal кнопки

  // Обработчик изменения суммы
  const handleAmountChange = (newAmount) => {
    setAmount(newAmount);
    setKey(prevKey => prevKey + 1); // Обновляем ключ для перерендера
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <div className="container mt-5">
        <h2 className="text-center">Оплата услуги</h2>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card p-4">
              {/* Поле для отображения выбранной суммы */}
              <h4 className="text-center mb-4">Выберите сумму</h4>
              <input 
                type="text" 
                className="form-control mb-4 text-center" 
                value={`${amount} €`} 
                readOnly 
                style={{ maxWidth: "400px", margin: "0 auto" }} 
              />
              
              {/* Кнопки для изменения суммы */}
              <div className="row g-3 text-center mb-4">
                { [400, 450, 500, 550, 600, 650, 700, 750].map((value) => (
                  <div key={value} className="col-3">
                    <button 
                      className="btn btn-outline-primary w-100" 
                      onClick={() => handleAmountChange(value)}>
                      {value} €
                    </button>
                  </div>
                )) }
              </div>
              
              {/* PayPal кнопка с динамическим ключом */}
              <PayPalButtons
                key={key} // Обновляем ключ для перерендера
                style={{ layout: "vertical" }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: amount.toString(), // Используем выбранную сумму
                        },
                      },
                    ],
                  });
                }}
                onApprove={(data, actions) => {
                  return actions.order.capture().then((details) => {
                    alert(`Оплата произведена, ${details.payer.name.given_name}`);
                  });
                }}
                onError={(err) => {
                  console.error("Ошибка оплаты:", err);
                  alert("Произошла ошибка при оплате.");
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
