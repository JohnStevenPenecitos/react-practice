import { useNavigate } from "react-router-dom";
import Alert from "./Alert";
import Button from "./Button";
import { useEffect, useState } from "react";

interface Props {
  title: string;
}

const Home = ({ title }: Props) => {
  const [alertVisible, setAlertVisibility] = useState(false);
  const [alertVisible1, setAlertVisibility1] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = title;
    return () => {
      document.title = "Default Title";
    };
  }, [title]);

  return (
    <>
      <h1>This is Home!</h1>
      {alertVisible && (
        <Alert onClose={() => setAlertVisibility(false)}>
          <h1>Hi!</h1>
        </Alert>
      )}

      {alertVisible1 && (
        <Alert onClose={() => setAlertVisibility1(false)}>
          <h1>Hi2!</h1>
        </Alert>
      )}

      <Button color="red" onClick={() => setAlertVisibility(true)}>
        JS Button
      </Button>

      <Button color="blue" onClick={() => setAlertVisibility1(true)}>
        Kaye Button
      </Button>

      <Button color="red" onClick={() => setAlertVisibility(true)}>
        JS Button
      </Button>

      <Button color="blue" onClick={() => setAlertVisibility1(true)}>
        Kaye Button
      </Button>

      <Button color="red" onClick={() => setAlertVisibility(true)}>
        JS Button
      </Button>

      <Button color="blue" onClick={() => setAlertVisibility1(true)}>
        Kaye Button
      </Button>

      <Button color="red" onClick={() => setAlertVisibility(true)}>
        JS Button
      </Button>

      <Button color="blue" onClick={() => setAlertVisibility1(true)}>
        Kaye Button
      </Button>

      <Button color="red" onClick={() => setAlertVisibility(true)}>
        JS Button
      </Button>

      <Button color="blue" onClick={() => setAlertVisibility1(true)}>
        Kaye Button
      </Button>

      <Button color="red" onClick={() => setAlertVisibility(true)}>
        JS Button
      </Button>

      <Button color="blue" onClick={() => navigate('/about')}>
        Kaye Button
      </Button>

    </>
  );
};

export default Home;
