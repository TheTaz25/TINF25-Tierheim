const animalBuilder = () => {
  const stats = {
    health: 100,
    energy: 100,
    hunger: 50,
    trust: 0,
  };

  const inventory = [];

  function setHealth (delta) {
    stats.health = stats.health + delta;
    console.log(`New health is: ${stats.health}`);
  }

  function getHealth () {
    return stats.health;
  }

  return {
    getHealth,
    setHealth,
  };
};

const dog = animalBuilder();

window.dog = dog;
console.log(dog);