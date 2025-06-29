import React, { useState } from "react";

export default function PaiementForm({ onConfirm }) {
  const [method, setMethod] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankName, setBankName] = useState("");

  const handleConfirm = () => {

    if (!method) {
      alert("Choisissez une méthode de paiement");
      return;
    }
    onConfirm({
      method,
      cardNumber,
      expiry,
      cvv,
      paypalEmail,
      bankAccount,
      bankName,
    });
  };

  return (
    <div>
      <h2>Méthode de paiement</h2>
      <select value={method} onChange={(e) => setMethod(e.target.value)}>
        <option value="">-- Choisir une méthode --</option>
        <option value="Carte Bancaire">Carte Bancaire</option>
        <option value="PayPal">PayPal</option>
        <option value="Virement Bancaire">Virement Bancaire</option>
      </select>

      {method === "Carte Bancaire" && (
        <>
          <input
            type="text"
            placeholder="Numéro de carte"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
          <input
            type="text"
            placeholder="Date d'expiration (MM/AA)"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
          />
          <input
            type="text"
            placeholder="CVV"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
          />
        </>
      )}

      {method === "PayPal" && (
        <input
          type="email"
          placeholder="Email PayPal"
          value={paypalEmail}
          onChange={(e) => setPaypalEmail(e.target.value)}
        />
      )}

      {method === "Virement Bancaire" && (
        <>
          <input
            type="text"
            placeholder="Numéro de compte bancaire"
            value={bankAccount}
            onChange={(e) => setBankAccount(e.target.value)}
          />
          <input
            type="text"
            placeholder="Nom de la banque"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
          />
        </>
      )}

      <button onClick={handleConfirm}>Confirmer le paiement</button>
    </div>
  );
}
