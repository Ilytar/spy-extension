import { POPUP_SCRIPT_SENDERS_TYPES } from "@common/api/types/messagesTypes";
import { Add } from "@mui/icons-material";
import { Box, Button, Modal, Typography } from "@mui/material";
import { FormInput } from "@popup/app/Pages/UserForm/FornInput";
import { useToast } from "@popup/hooks/toast/useToast";
import { popupApi } from "@popup/popupApi";
import { useState } from "react";

interface NewAuthorModalProps {
  open: boolean;
  handleClose: () => void;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export const NewAuthorModal = ({ open, handleClose }: NewAuthorModalProps) => {
  const [author, setAuthor] = useState<string>("");
  const showToast = useToast();

  const createNewAuthor = () => {
    try {
      popupApi.sendMessageInRuntime(
        POPUP_SCRIPT_SENDERS_TYPES.SEND_NEW_AUTHOR,
        author
      );
    } catch (error) {
      showToast({
        type: "error",
        content: error as string,
      });
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Добавить пользователя
        </Typography>
        <FormInput
          label="Добавить пользователя"
          id="new_user"
          onChangeHandler={(_, value) => {
            if (value) {
              setAuthor(value);
            }
          }}
        />
        <Button onClick={createNewAuthor}>
          <Add /> Добавить автора
        </Button>
      </Box>
    </Modal>
  );
};
