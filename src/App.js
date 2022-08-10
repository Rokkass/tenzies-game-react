import styles from "./App.module.css";
import Dice from "./components/Dice/Dice";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

function App() {
  const allNewDice = () => {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  };
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [rolls, setRolls] = useState(0);
  const [time, setTime] = useState({
    duration: 0,
    bestTime: localStorage.getItem("tenziesBestTime") || 99999,
  });

  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
    }

    const held = dice.filter((die) => die.isHeld).length;
    if (held === 1) {
      setTime((prevTime) => ({ ...prevTime, start: Date.now() }));
    } else if (tenzies) {
      const isBetter =
        time.bestTime < (Date.now() - time.start) / 1000
          ? time.bestTime
          : (Date.now() - time.start) / 1000;
      setTime((prevTime) => ({
        ...prevTime,
        duration: (Date.now() - time.start) / 1000,
        bestTime: isBetter,
      }));
      localStorage.setItem("tenziesBestTime", isBetter);
    }
  }, [dice, tenzies]);

  function generateNewDie() {
    return {
      id: nanoid(),
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
    };
  }

  const rollDice = () => {
    if (!tenzies) {
      setDice((oldDie) =>
        oldDie.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
      setRolls((oldRols) => oldRols + 1);
    } else {
      setTenzies(false);
      setDice(allNewDice);
      setRolls(0);
    }
  };

  const holdDie = (id) => {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  };

  const diceElements = dice.map((die) => (
    <Dice
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDie={() => holdDie(die.id)}
    />
  ));

  return (
    <>
      <main>
        {tenzies && <Confetti />}
        <h2>Tenzies</h2>
        <p>
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>
        <div className={styles.dice__wrapper}>{diceElements}</div>
        <div className={styles.bottom__wrapper}>
          <div className={styles.rolls}>Rolls: {rolls}</div>
          <button className={styles.roll__button} onClick={rollDice}>
            {tenzies ? "New Game" : "Roll"}
          </button>
        </div>
      </main>
      <div className={styles.times__wrapper}>
        <h3>Time: {time.duration > 0 && time.duration + "s"}</h3>
        <h2>Best time: {time.bestTime < 99999 && time.bestTime + "s"}</h2>
      </div>
    </>
  );
}

export default App;
