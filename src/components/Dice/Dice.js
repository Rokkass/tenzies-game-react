import styles from "./Dice.module.scss";
import IMAGES from "../../images";

const Dice = (props) => {
  return (
    <img
      className={props.isHeld ? styles.dice__isHeld : styles.dice}
      src={IMAGES[props.value - 1].src}
      onClick={props.holdDie}
    />
  );
};
export default Dice;
