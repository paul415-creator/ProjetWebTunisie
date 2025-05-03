// utils/priceCalculator.js
function calculateRentalPrice(pricePerDay, startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Calculer la différence en millisecondes
    const diffTime = Math.abs(end - start);
    
    // Convertir en jours (et toujours arrondir vers le haut)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Si la location est sur le même jour, compter au moins une journée
    const rentalDays = diffDays === 0 ? 1 : diffDays;
    
    // Calculer le prix total
    const totalPrice = pricePerDay * rentalDays;
    
    return {
      numberOfDays: rentalDays,
      pricePerDay: pricePerDay,
      totalPrice: totalPrice
    };
  }
  
  module.exports = { calculateRentalPrice };