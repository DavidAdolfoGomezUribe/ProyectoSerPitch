import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import TextField from '@mui/material/TextField';




const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ModalForm() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [textValue, setTextValue] = useState('');
  const [numberValue, setNumberValue] = useState('');



const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log({ textValue, numberValue });
    // Aquí tu lógica de envío
};



  return (
    <div>
      <Button onClick={handleOpen}>Buy a Car</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        
      >
        <Box sx={style}>

          <Typography id="modal-modal-title" variant="h6" component="h2">
            Please fill this form with your data
          </Typography>

          
          <form onSubmit={handleSubmit}>
            <TextField
                label="Texto"
                variant="outlined"
                type="text"
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                fullWidth
                margin="normal"
            />
            
            <TextField
                label="Número"
                variant="outlined"
                type="number"
                value={numberValue}
                onChange={(e) => setNumberValue(e.target.value)}
                fullWidth
                margin="normal"
                InputProps={{
                inputProps: { 
                    min: 0 
                }
                }}
            />
            
            <Button 
                variant="contained" 
                type="submit"
                sx={{ mt: 2 }}
            >
                Enviar
            </Button>
    </form>

        </Box>

      </Modal>
    </div>
  );
}