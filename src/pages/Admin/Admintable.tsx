import React, { useState } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import Pagination from 'react-js-pagination';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { setData } from '../../redux/apiData/apiDataSlice.js';
import { useApiData } from '../../hooks/useApiData.js';
import TextField from '@mui/material/TextField';

import { FormControl, FormLabel, backdropClasses } from '@mui/material';
import { Slider } from '@mui/material';
import { Checkbox } from '@mui/material';



import './AdminTable.css';
import { style } from '@mui/system';

const options = [
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  { value: 20, label: '20' },
];

const AdminTable = () => {
 const { data, isLoading, error ,refresh} = useApiData('GET', 'Users/list', 'adminTableData');
  console.log(data)
  const { apiCall: editUserApiCall } = useApiData('PUT', '', 'editUser');
const { apiCall: deleteUserApiCall } = useApiData('DELETE', 'Users?{user._id}', 'deleteUser');

  const dispatch = useDispatch();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRowModal, setShowRowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [activePage, setActivePage] = useState(1);
  const [itemsCountPerPage, setItemsCountPerPage] = useState(10);
  const [sortType, setSortType] = useState('asc');
  const [sortColumn, setSortColumn] = useState('id');
  const [selectedOption, setSelectedOption] = useState(options[1]);
    const [formData,setFormData] = useState({})

    const [value1, setValue1] = useState([0, 100]);
    const handleChangeSLider = (event, newValue) => {
      setValue1(newValue);
    };

     const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      };


  const handleRowClick = (user) => {
    setCurrentUser(user);
    setShowRowModal(true);
  };
  
  const handleEdit = async (user) => {
 setCurrentUser(user);
 setShowEditModal(true);
 // When the user submits the form in the edit modal,
 // call the editUserApiCall function with the updated user details
 const updatedUser = {...user, /* updates go here */}
 try {
  await editUserApiCall(updatedUser, {id: user._id});
  console.log("User updated successfully");
  // Refetch the users to get the updated list
  // You might need to add a function to do this if you don't have one already
  refetchUsers();
 } catch (error) {
  console.error("Failed to update user:", error);
 }
 };

  const handleSort = (column) => {
    const newSortType = sortType === 'asc' ? 'desc' : 'asc';
    setSortType(newSortType);
    setSortColumn(column);
    console.log(`Sort type: ${newSortType}, Sort column: ${column}, Active page: ${activePage}, Records per page: ${itemsCountPerPage}`);
  };

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    console.log(`Sort type: ${sortType}, Sort column: ${sortColumn}, Active page: ${pageNumber}, Records per page: ${itemsCountPerPage}`);
  };

  const handleRecordPerPage = (selectedOption) => {
    setSelectedOption(selectedOption);
    setItemsCountPerPage(selectedOption.value);
    console.log(`Sort type: ${sortType}, Sort column: ${sortColumn}, Active page: ${activePage}, Records per page: ${selectedOption.value}`);
  };

  // Sort the data
 const sortedData = Array.isArray(data) 
    ? [...data].sort((a, b) => {
        const itemA = a[sortColumn];
        const itemB = b[sortColumn];

        let comparison = 0;
        if (itemA > itemB) {
          comparison = 1;
        } else if (itemA < itemB) {
          comparison = -1;
        }
        return sortType === 'asc' ? comparison : comparison * -1;
      })
    : [];


const handleDelete = async (user) => {
  setCurrentUser(user);
  setShowDeleteModal(true);
  // When the user confirms the deletion in the delete modal,
  // call the deleteUserApiCall function
  try {
    await deleteUserApiCall(null, {id: user._id});
    console.log("User deleted successfully");
    // Refetch the users to get the updated list
    // useApiData('GET', 'Users/list', 'adminTableData');
    refresh()
     setShowDeleteModal(false);
  } catch (error) {
    console.error("Failed to delete user:", error);
    
  }
};


  // Update the data in Redux store
  if (!isLoading && !error) {
    dispatch(setData({ name: 'adminTableData', data }));
  }

  return (
    <>
     <Select
        value={selectedOption}
        onChange={handleRecordPerPage}
        options={options}
      />

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>Name</th>
            <th className='mobile-hide' onClick={() => handleSort('email')}>Email</th>
            <th className='mobile-hide' onClick={() => handleSort('address')}>Address</th>
            <th onClick={() => handleSort('phone')}>Phone</th>
            <th className='mobile-hide'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedData
            .slice((activePage - 1) * itemsCountPerPage, activePage * itemsCountPerPage)
            .map((user) => (
              <tr key={user._id} onClick={() => handleRowClick(user)}>
                <td>{user.name}</td>
                <td className='mobile-hide'>{user.email}</td>
                <td className='mobile-hide'>{user.Address}</td>
                <td>{user.contact}</td>
                <td className='mobile-hide'>
                  <Button onClick={(e) => { e.stopPropagation(); handleEdit(user); }} >Edit</Button>
                  <Button onClick={(e) => { e.stopPropagation(); handleDelete(user); }}>Delete</Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>








     <Pagination
  className='my-pagination'
  activePage={activePage}
  itemsCountPerPage={itemsCountPerPage}
  totalItemsCount={Array.isArray(data) ? data.length : 0}
  pageRangeDisplayed={5}
  onChange={handlePageChange}
/>


      <Modal show={showRowModal} onHide={() => setShowRowModal(false)} className='my-modal'>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
           <FormControl>
                <FormLabel>name</FormLabel>
                <TextField 
                    label="name"
                    type="text"
                    name="name"
                    fullWidth
                    value={currentUser?.name ||formData?.name}
                    onChange={handleChange}
                />
                <FormLabel>email</FormLabel>
                <TextField 
                    label="email"
                    type="email"
                    name="email"
                    fullWidth
                    value={currentUser?.email || formData?.email}
                    onChange={handleChange}
                />
                <FormLabel>address</FormLabel>
                <TextField 
                    label="address"
                    type="text"
                    name="address"
                    fullWidth
                    value={currentUser?.address ||formData?.address}
                    onChange={handleChange}
                />
                <FormLabel>phone</FormLabel>
                <TextField 
                    label="phone"
                    type="number"
                    name="phone"
                    fullWidth
                    value={currentUser?.contact ||formData?.phone}
                    onChange={handleChange}
                />
                <Button onClick={()=> console.log(formData)} type="button" variant="contained">ADD</Button>
        
    </FormControl>
          <Button onClick={() => setShowRowModal(false)}>OK</Button>
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} className='my-modal'>
        {/* Your form with user details */}
        <Button onClick={() => { console.log(currentUser); setShowEditModal(false); }}>Save</Button>
        <Button onClick={() => setShowEditModal(false)}>Cancel</Button>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} className='my-modal'>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure you want to delete?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button onClick={() => { console.log(currentUser); setShowDeleteModal(false);  } } style={ {backgroundColor:"red" , marginTop:"300px" } }>Yes</Button>
          <Button onClick={() => setShowDeleteModal(false)}>No</Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AdminTable;