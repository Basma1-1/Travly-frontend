import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import "./Home.css"

import welcomeImg from '../../Components/Assets/welcome.jpg'; 
import marrakechImg from '../../Components/Assets/marrakech.jpg';
import romaImg from '../../Components/Assets/roma.jpg';
import baliImg from '../../Components/Assets/bali.jpg';

const cities = [
  {
    id: 13,
    name: 'Marrakech, Maroc',
    image: marrakechImg,
    description: 'Vivez l’aventure marocaine au cœur des souks colorés et les palais royaux.',
    price: 'Dès 630€'
  },
  {
    id: 14,
    name: 'Rome, Italie',
    image: romaImg,
    description: 'Explorez Rome, émerveillez-vous de sa magie et vivez l’histoire à chaque pas. ',
    price: 'Dès 752€'
  },
  {
    id: 15,
    name: 'Bali, Indonésie',
    image: baliImg,
    description: 'Vivez une aventure tropicale hors du commun, entre plages idylliques et traditions fascinantes',
    price: 'Dès 990€'
  }
];

function Home(darkMode) {
  const navigate = useNavigate();  
  
  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="welcome-image">
        <img src={welcomeImg} alt="Bannière principale" />
        <section className="welcome-section">
          <h1>Bienvenue sur Travly !</h1>
          <p>
            Explorez le monde avec nous et laissez-vous emporter par la magie du voyage !
            Découvrez des destinations de rêve à des prix maîtrisés.
          </p>
        </section>
      </div>

      <section className="destinations-section">
        {cities.map((city, index) => (
          <div 
            className={`card ${index % 2 !== 0 ? 'reverse' : ''}`}
            key={index}
          >
            <div className="image">
              <img src={city.image} alt={city.name} />
              <div className="overlay"></div>
            </div>
            <div className="text">
              <h2>{city.name}</h2>
              <p>{city.description}</p>
              <p className="price">{city.price}</p>
              <button
                className="btn-reserver"
                onClick={() => navigate(`/details/${city.id}`, { state: city })}
              >
                Réserver maintenant
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Home;



