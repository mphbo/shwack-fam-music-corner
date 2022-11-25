import { Avatar, Box, Button, Stack, Text } from "grommet";
import { Cloudinary } from "@cloudinary/url-gen";
import keys from "../../../../utils/keys";
import { fill } from "@cloudinary/url-gen/actions/resize";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./styles/User.module.scss";

export const User = ({ id, username }) => {
  const router = useRouter();

  const cld = new Cloudinary({
    cloud: {
      cloudName: keys.cloudName,
    },
  });

  const img = cld.image(`shwackcloud/${id}`);
  img.resize(fill(60, 60));
  console.log(img.toURL());

  return (
    <div>
      <Box align="center" overflow="hidden" className={styles.user}>
        <Button
          onClick={() => router.push(`/chat/${id}`)}
          icon={
            <Avatar
              size="medium"
              src={`https://res.cloudinary.com/${keys.cloudName}/image/upload/c_fill,h_60,w_60/d_shwackcloud:horse.jpg/shwackcloud/${id}.jpg`}
            ></Avatar>
          }
        />
        <Text
          textAlign="center"
          className={styles.text}
          size="small"
          onClick={() => router.push(`/chat/${id}`)}
        >
          {username}
        </Text>
      </Box>
    </div>
  );
};