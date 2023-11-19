import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, TextField, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, ListItemIcon } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import notesImage from './notes.png';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';

const CenteredDialog = styled(Dialog)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: stretch;;
  margin-bottom: 16px;
  margin-top:10px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const CreateNoteLabel = styled.span`
  font-size: 8px;
  color: #555;
`;

const LogoutButton = styled(Button)`
  margin-left: auto;
`;

function Notes({url}) {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState(''); 
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalViewOpen, setModalViewOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); 
  const [viewNotes, setViewNotes] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');

  const accessToken = localStorage.getItem('accessToken');
  const userId = localStorage.getItem('userId');
  console.log(accessToken)

  const navigate = useNavigate();

  const fetchNotes = async () => {
    try{
      const response = await axios.get(`${url}/user/notes/${userId}`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      console.log(response.data);
      setNotes(response.data.notes)
    }catch(error){
      console.log(error)
    }
  }

  useEffect(()=>{
    if(!accessToken || !userId){
      return navigate('/')
    }
    fetchNotes()
  },[])


  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredNotes = notes.filter((note) =>
    note.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditIndex(null)
    setNewNote('')
    setValidationError('')
  };

  const formatTimeDifference = (createdTime) => {
    const currentTime = new Date();
    const diffInMilliseconds = currentTime - new Date(createdTime);
  
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30 * day;
  
    if (diffInMilliseconds < minute) {
      return 'a moment ago';
    } else if (diffInMilliseconds < hour) {
      const minutesAgo = Math.floor(diffInMilliseconds / minute);
      return `${minutesAgo} minute${minutesAgo !== 1 ? 's' : ''} ago`;
    } else if (diffInMilliseconds < day) {
      const hoursAgo = Math.floor(diffInMilliseconds / hour);
      return `${hoursAgo} hour${hoursAgo !== 1 ? 's' : ''} ago`;
    } else if (diffInMilliseconds < month) {
      const daysAgo = Math.floor(diffInMilliseconds / day);
      return `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`;
    } else {
      // Display date and time for more than 30 days
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
      return new Date(createdTime).toLocaleDateString(undefined, options);
    }
  };
  

  const handleAddNote = async() => {
    if (!newNote) {
      setValidationError("Note field can't be empty");
      return;
    }
    try{
      console.log(newNote, "New-Notes")
      const response = await axios.post(
        `${url}/user/create-notes/${userId}`,
        {
          notes: newNote,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data.message);
      fetchNotes();
      toast.success(response.data.message);
    }catch(error){
      console.log(error);
    }
    setNewNote('');
    handleCloseModal();
  };

  const handleEditNote = (index) => {
    setEditIndex(index);
    setNewNote(notes[index].notes);
    handleOpenModal();
  };

  const handleOpenViewModal = () => {
    setModalViewOpen(true)
  }

  const handleUpdateNote = async () => {
    if (!newNote) {
      setValidationError("Note field can't be empty");
      return;
    }
    try {
      const response = await axios.put(
        `${url}/user/edit-notes/${userId}/${notes[editIndex]._id}`,
        {
          notes: newNote,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data.message);
      fetchNotes();
      toast.success(response.data.message);
      setEditIndex(null);
      setNewNote('');
      handleCloseModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteNote = async(index) => {
    try {
      const response = await axios.delete(
        `${url}/user/delete-notes/${userId}/${notes[index]._id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data.message);
      fetchNotes();
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewNotes = async(index) => {
    try {
      const response = await axios.get(
        `${url}/user/view-notes/${userId}/${notes[index]._id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      if( response.data.message == "Note fetched successfully"){
        console.log(response.data.notes, "reached")
        setViewNotes(response.data.notes.notes);
        setUpdatedAt(response.data.notes.updatedAt);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    navigate('/');
  };

  const handleCloseViewModal = () => {
    setModalViewOpen(false);
  }

  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }

  return (
    <>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search notes"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div style={{display:'flex', flexDirection:'column', marginLeft: 10}}>
            <IconButton color="primary" onClick={handleOpenModal}>
              <AddIcon />
            </IconButton>
            <CreateNoteLabel>Create Note</CreateNoteLabel>
          </div>
        </SearchContainer>

        <CenteredDialog open={isModalOpen} onClose={handleCloseModal}>
          <DialogTitle>{editIndex !== null ? 'Edit Note' : 'Add Note'}</DialogTitle>
          <DialogContent>
          <TextareaAutosize
            aria-label="Note"
            minRows={3} // Adjust the number of rows as needed
            placeholder="Enter your note here"
            value={newNote}
            onChange={(e) => {
              setNewNote(e.target.value);
              setValidationError('');
            }}
            style={{ width: '100%' }}
          />
            <Button color="primary" onClick={editIndex !== null ? handleUpdateNote : handleAddNote}>
              {editIndex !== null ? 'Update' : 'Add'}
            </Button>
            <Button color="error" onClick={handleCloseModal}>
              Cancel
            </Button>
          </DialogContent>
        </CenteredDialog>

        <CenteredDialog open={isModalViewOpen} onClose={handleCloseViewModal}>
          <div style={{display: "flex", justifyContent:'space-between'}}>
          <DialogTitle>Note</DialogTitle>
          <p>Updated: {formatTimeDifference(updatedAt)}</p>
          </div>
          <DialogContent>
          <TextareaAutosize
            aria-label="Note"
            minRows={3}
            value={viewNotes}
            style={{ width: '100%' }}
          />
            <Button color="error" onClick={handleCloseViewModal}>
              Close
            </Button>
          </DialogContent>
        </CenteredDialog>

        {notes.length === 0 ? (
          <div>
            <img src={notesImage} alt="Create Notes"/>
            <p>Create notes to remind yourself!</p>
          </div>  
        ) : (
          <List>
          {filteredNotes?.length > 0 ?
          filteredNotes.map((note, index) => (
            <ListItem key={index} style={{ maxWidth: '400px' }}>
              <ListItemText primary={truncateText(note.notes, 50)} secondary={formatTimeDifference(note.createdAt)} />
              <ListItemIcon>
                <IconButton edge="end" onClick={() => handleViewNotes(index)}>
                <VisibilityIcon onClick={handleOpenViewModal} />
                </IconButton>
              </ListItemIcon>
              <ListItemIcon style={{marginLeft: 10}}>
                <EditIcon onClick={() => handleEditNote(index)} />
              </ListItemIcon>
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleDeleteNote(index)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          )) :
          <div>
            <p>No Notes Found</p>
          </div>
        }
        </List>
        )}
      </div>
    </div>
    <div style={{ display: 'flex', alignItems:'center', justifyContent:"center"}}>
      <LogoutButton variant="contained" color="primary" onClick={handleLogout}>
        Logout
      </LogoutButton>
    </div>
    </>
  );
}

export default Notes;
