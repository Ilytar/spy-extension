import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { AccountCircle } from "@mui/icons-material";
import { FormInput } from "./FornInput";
import { useEffect, useState } from "react";
import { User, UserFormInputs } from "@common/storage/types/user";
import storageLocal from "@common/storage/storageLocal/storageLocal.class";
import { useToast } from "@popup/hooks/toast/useToast";

const formInputsData: UserFormInputs = [
  { id: "last_name", label: "Фамилия", type: "text" },
  { id: "first_name", label: "Имя", type: "text" },
  { id: "middle_name", label: "Отчество", type: "text" },
  { id: "email", label: "Почта", type: "email" },
];

export default function UserForm() {
  const [userData, setUserData] = useState<User | null>(null);

  const updateInputData = (id: string, value: string) => {
    setUserData((prev) => {
      return {
        ...(prev as User),
        [id]: value,
      };
    });
  };

  useEffect(() => {
    storageLocal.getUserData().then((userData) => {
      if (userData) {
        setUserData(userData);
      } else {
        setUserData({
          last_name: "",
          first_name: "",
          middle_name: "",
          email: "",
        });
      }
    });
  }, []);

  const showToast = useToast();

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1 }}>
          <AccountCircle />
        </Avatar>
        <Typography component="h1" variant="h5">
          Данные пользователя
        </Typography>
        {userData && (
          <Box sx={{ mt: 1 }}>
            {formInputsData.map((inputData) => (
              <FormInput
                {...inputData}
                onChangeHandler={updateInputData}
                initialValue={userData[inputData.id]}
              />
            ))}

            <Box>
              <Button
                onClick={async () => {
                  try {
                    await storageLocal.setUserData(userData);
                    showToast({
                      type: "success",
                      content: "Данные сохранены",
                    });
                  } catch {
                    showToast({
                      type: "error",
                      content: "Не удалось сохранить данные",
                    });
                  }
                }}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Сохранить
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
}
