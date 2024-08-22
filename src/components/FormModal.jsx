import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  FormControl,
  FormLabel,
  Button,
  Input,
  Checkbox,
  VStack,
  FormErrorMessage,
  Flex,
} from '@chakra-ui/react';
import { Select as ChakraSelect } from 'chakra-react-select';
import { useNavigate } from 'react-router-dom';

const FormModal = ({ isOpen, onClose, onSave }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    schoolName: '',
    year: '',
    major: '',
    isUndeclared: false,
    status: '',
    borough: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setForm((prev) => ({
      ...prev,
      isUndeclared: checked,
      major: checked ? 'Undeclared' : '',
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.schoolName) newErrors.schoolName = 'School name is required';
    if (!form.year) newErrors.year = 'Year is required';
    if (!form.major) newErrors.major = 'Major is required';
    if (!form.status) newErrors.status = 'Status is required';
    if (!form.borough) newErrors.borough = 'Borough is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(form);
      onClose();
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const schoolOptions = [
    { value: 'Baruch College', label: 'Baruch College' },
    { value: 'Brooklyn College', label: 'Brooklyn College' },
    { value: 'City College of New York', label: 'City College of New York' },
    { value: 'College of Staten Island', label: 'College of Staten Island' },
    { value: 'CUNY Graduate Center', label: 'CUNY Graduate Center' },
    { value: 'CUNY School of Law', label: 'CUNY School of Law' },
    { value: 'CUNY School of Professional Studies', label: 'CUNY School of Professional Studies' },
    { value: 'CUNY School of Public Health', label: 'CUNY School of Public Health' },
    { value: 'Guttman Community College', label: 'Guttman Community College' },
    { value: 'Hostos Community College', label: 'Hostos Community College' },
    { value: 'Hunter College', label: 'Hunter College' },
    { value: 'John Jay College of Criminal Justice', label: 'John Jay College of Criminal Justice' },
    { value: 'Kingsborough Community College', label: 'Kingsborough Community College' },
    { value: 'LaGuardia Community College', label: 'LaGuardia Community College' },
    { value: 'Lehman College', label: 'Lehman College' },
    { value: 'Medgar Evers College', label: 'Medgar Evers College' },
    { value: 'New York City College of Technology', label: 'New York City College of Technology' },
    { value: 'Queens College', label: 'Queens College' },
    { value: 'Queensborough Community College', label: 'Queensborough Community College' },
    { value: 'School of Labor and Urban Studies', label: 'School of Labor and Urban Studies' },
    { value: 'School of Professional Studies', label: 'School of Professional Studies' },
    { value: 'School of Public Health', label: 'School of Public Health' },
    { value: 'York College', label: 'York College' },
    { value: 'Bronx Community College', label: 'Bronx Community College' },
    { value: 'Borough of Manhattan Community College', label: 'Borough of Manhattan Community College' }
  ];

  const yearOptions = [
    { value: 'Freshman', label: 'Freshman' },
    { value: 'Sophomore', label: 'Sophomore' },
    { value: 'Junior', label: 'Junior' },
    { value: 'Senior', label: 'Senior' },
  ];

  const statusOptions = [
    { value: 'Part time', label: 'Part time' },
    { value: 'Full Time', label: 'Full Time' },
  ];

  const boroughOptions = [
    { value: 'Manhattan', label: 'Manhattan' },
    { value: 'Brooklyn', label: 'Brooklyn' },
    { value: 'Queens', label: 'Queens' },
    { value: 'Staten Island', label: 'Staten Island' },
    { value: 'The Bronx', label: 'The Bronx' },
  ];

  // this doesn't work im gonna attempt to fix this so the dropdowns have more style to them.
  const selectStyles = {
    dropdownIndicator: (provided) => ({
      ...provided,
      color: '#204CAD',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#204CAD' : 'white',
      color: state.isSelected ? 'white' : 'black',
      '&:hover': {
        backgroundColor: '#204CAD',
        color: 'white',
      },
    }),
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} closeOnEsc={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Your School Info</ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.schoolName}>
              <FormLabel>School Name*</FormLabel>
              <ChakraSelect
                name="schoolName"
                value={schoolOptions.find((opt) => opt.value === form.schoolName)}
                onChange={(opt) => handleChange({ target: { name: 'schoolName', value: opt.value } })}
                options={schoolOptions}
                styles={selectStyles}
              />
              <FormErrorMessage>{errors.schoolName}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.year}>
              <FormLabel>Year*</FormLabel>
              <ChakraSelect
                name="year"
                value={yearOptions.find((opt) => opt.value === form.year)}
                onChange={(opt) => handleChange({ target: { name: 'year', value: opt.value } })}
                options={yearOptions}
                styles={selectStyles}
              />
              <FormErrorMessage>{errors.year}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.major}>
              <FormLabel>Major*</FormLabel>
              <Input
                name="major"
                value={form.major}
                onChange={handleChange}
                isDisabled={form.isUndeclared}
                placeholder="Enter your major..."
              />
              <Checkbox
                isChecked={form.isUndeclared}
                onChange={handleCheckboxChange}
                mt={2}
              >
                Undeclared
              </Checkbox>
              <FormErrorMessage>{errors.major}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.status}>
              <FormLabel>Status*</FormLabel>
              <ChakraSelect
                name="status"
                value={statusOptions.find((opt) => opt.value === form.status)}
                onChange={(opt) => handleChange({ target: { name: 'status', value: opt.value } })}
                options={statusOptions}
                styles={selectStyles}
              />
              <FormErrorMessage>{errors.status}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.borough}>
              <FormLabel>Borough*</FormLabel>
              <ChakraSelect
                name="borough"
                value={boroughOptions.find((opt) => opt.value === form.borough)}
                onChange={(opt) => handleChange({ target: { name: 'borough', value: opt.value } })}
                options={boroughOptions}
                styles={selectStyles}
              />
              <FormErrorMessage>{errors.borough}</FormErrorMessage>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Flex justify="center" width="100%">
            <Button colorScheme="gray" onClick={handleBack} mr={3}>
              Back
            </Button>
            <Button 
              color="#FFB71B"
              bg="#204CAD"
              _hover={{ bg: "#071B49" }} 
              onClick={handleSubmit}
            >
              Continue
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FormModal;