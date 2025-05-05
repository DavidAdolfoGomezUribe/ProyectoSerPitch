import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "80vw",
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const cars = [
  { name: 'Toyota Corolla Cross Hybrid GR Sport', price: 1 },
  { name: 'Suzuki Grand Vitara', price: 1.1 },
  { name: 'Suzuki S-Presso', price: 1.2 },
  { name: 'Subaru WRX', price: 1.3 },
  { name: 'Chery Omoda 5', price: 1.4 },
];

interface FormState {
  firstName: string;
  lastName: string;
  country: string;
  phone: string;
  address: string;
  selectedCar: string;
  quantity: number;
  price: number;
}

export default function ModalForm() {
  const [open, setOpen] = React.useState(false);
  const [formState, setFormState] = useState<FormState>({
    firstName: '',
    lastName: '',
    country: '',
    phone: '',
    address: '',
    selectedCar: '',
    quantity: 0,
    price: 0
  });



  // Guardar datos en localStorage cuando cambien

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const selectedCar = cars.find(car => car.name === formState.selectedCar);
  const finalPrice = selectedCar ? selectedCar.price * formState.quantity : 0;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    localStorage.setItem('carPurchases', JSON.stringify({
        ...formState,
        price: finalPrice
      }));


    // Limpiar formulario después de enviar
    setFormState({
      firstName: '',
      lastName: '',
      country: '',
      phone: '',
      address: '',
      selectedCar: '',
      quantity: 0,
      price: 0
      
    });
    handleClose();
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
          <Typography variant="h6" component="h2">
            Please fill this form with your data
          </Typography>

          <form onSubmit={handleSubmit}>
            <div className='flex gap-4'>
              <TextField
                label="First Name"
                value={formState.firstName}
                onChange={(e) => setFormState({...formState, firstName: e.target.value})}
                fullWidth
                margin="normal"
              />
              
              <TextField
                label="Last Name"
                value={formState.lastName}
                onChange={(e) => setFormState({...formState, lastName: e.target.value})}
                fullWidth
                margin="normal"
              />
            </div>

            <TextField
              label="Country"
              value={formState.country}
              onChange={(e) => setFormState({...formState, country: e.target.value})}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Phone"
              value={formState.phone}
              onChange={(e) => setFormState({...formState, phone: e.target.value})}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Address"
              value={formState.address}
              onChange={(e) => setFormState({...formState, address: e.target.value})}
              fullWidth
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Available Cars</InputLabel>
              <Select
                label="Avalible Cars"
                value={formState.selectedCar}
                onChange={(e) => setFormState({...formState, selectedCar: e.target.value})}
              >
                {cars.map((car) => (
                  <MenuItem key={car.name} value={car.name}>
                    {car.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Amount"
              type="number"
              value={formState.quantity}
              onChange={(e) => setFormState({...formState, quantity: Number(e.target.value)})}
              fullWidth
              margin="normal"
              InputProps={{
                inputProps: { 
                  min: 0 
                }
              }}
            />

            <Typography variant="h6" sx={{ mt: 2 }}>
              Total: ${finalPrice.toFixed(2)}
            </Typography>

            <Button 
              variant="contained" 
              type="submit"
              sx={{ mt: 2 }}
              
            >
              Add Car
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}