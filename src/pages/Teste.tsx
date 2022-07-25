import { Box, Button } from "@chakra-ui/react";
import { useState } from "react";

import { Tweet } from "../components/Tweet";

function Teste() {
  const [tweets, setTweets] = useState<string[]>([
    "Tweet 1",
    "Tweet 2",
    "Tweet 3",
    "Tweet 4",
  ]);

  function onHandleCreateTweet() {
    setTweets([...tweets, "Tweet 5"]);
  }

  return (
    <Box>
      {tweets.map((tweet) => (
        <Tweet text={tweet} />
      ))}
      <Button colorScheme="green" onClick={onHandleCreateTweet}>
        Adicionar tweet
      </Button>
    </Box>
  );
}

export default Teste;
