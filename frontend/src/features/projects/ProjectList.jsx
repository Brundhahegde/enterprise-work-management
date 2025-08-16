// import React, { useEffect, useState } from "react";
// import {
//   Typography, Box, Button, TextField, Paper, Table, TableBody, TableCell,
//   TableContainer, TableHead, TableRow, Snackbar, Alert, IconButton
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchProjects, addProject, updateProject, deleteProject, clearStatus } from "./projectSlice";

// export default function ProjectList() {
//   const dispatch = useDispatch();
//   const { projects, loading, error, success } = useSelector((s) => s.projects);
//   const { role } = useSelector((s) => s.auth);
//   const [form, setForm] = useState({ name: '', description: '', memberUsernames: '' });
//   const [editId, setEditId] = useState(null);

//   useEffect(() => { dispatch(fetchProjects()); }, [dispatch]);

//   const handleAdd = e => {
//     e.preventDefault();
//     if (!form.name) return;
//     dispatch(addProject({
//       ...form,
//       memberUsernames: form.memberUsernames.split(",").map(s => s.trim()).filter(Boolean)
//     })).then(action => {
//       if (action.meta.requestStatus === "fulfilled") setForm({ name: '', description: '', memberUsernames: '' });
//     });
//   };

//   const handleUpdate = e => {
//     e.preventDefault();
//     dispatch(updateProject({
//       id: editId,
//       ...form,
//       memberUsernames: form.memberUsernames.split(",").map(s => s.trim()).filter(Boolean)
//     })).then(action => {
//       if (action.meta.requestStatus === "fulfilled") {
//         setEditId(null);
//         setForm({ name: '', description: '', memberUsernames: '' });
//       }
//     });
//   };

//   const handleEdit = p => {
//     setEditId(p._id);
//     setForm({
//       name: p.name,
//       description: p.description || '',
//       memberUsernames: (p.members || []).map(u => u.username).join(", ")
//     });
//   };

//   const handleDelete = id => {
//     if (window.confirm("Delete this project?")) dispatch(deleteProject(id));
//   };

//   return (
//     <Box>
//       <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>Projects</Typography>
//       {(role === 'Admin' || role === 'Manager') && (
//         <Box component="form" onSubmit={editId ? handleUpdate : handleAdd} sx={{ display: "flex", gap: 2, mb: 3 }}>
//           <TextField label="Name *" size="small" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
//           <TextField label="Description" size="small" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
//           <TextField label="Members: email,..." size="small" value={form.memberUsernames} onChange={e => setForm(f => ({ ...f, memberUsernames: e.target.value }))} />
//           <Button type="submit" variant="contained">{editId ? "Save" : "Add Project"}</Button>
//           {editId && <Button onClick={() => { setEditId(null); setForm({ name: '', description: '', memberUsernames: '' }) }}>Cancel</Button>}
//         </Box>
//       )}
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Name</TableCell>
//               <TableCell>Description</TableCell>
//               <TableCell>Owner</TableCell>
//               <TableCell>Members</TableCell>
//               {(role === "Admin" || role === "Manager") && <TableCell align="center">Actions</TableCell>}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {loading && <TableRow><TableCell colSpan={5} align="center">Loading...</TableCell></TableRow>}
//             {(!loading && projects && projects.length === 0) && <TableRow>
//               <TableCell colSpan={5} align="center" style={{ opacity: 0.6 }}>No projects found.</TableCell>
//             </TableRow>}
//             {(!loading && projects && projects.length > 0) && projects.map(p => (
//               <TableRow key={p._id}>
//                 <TableCell>{p.name}</TableCell>
//                 <TableCell>{p.description}</TableCell>
//                 <TableCell>{p.owner?.username}</TableCell>
//                 <TableCell>{(p.members||[]).map(u => u.username).join(", ")}</TableCell>
//                 {(role === "Admin" || role === "Manager") &&
//                   <TableCell align="center">
//                     <Button size="small" onClick={() => handleEdit(p)}>Edit</Button>
//                     {role === "Admin" && (
//                       <IconButton color="error" onClick={() => handleDelete(p._id)}>
//                         <DeleteIcon />
//                       </IconButton>
//                     )}
//                   </TableCell>
//                 }
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <Snackbar open={!!success || !!error} autoHideDuration={3000} onClose={() => dispatch(clearStatus())}>
//         {success && <Alert severity="success">{success}</Alert>}
//         {error && <Alert severity="error">{error}</Alert>}
//       </Snackbar>
//     </Box>
//   );
// }


import React, { useEffect, useState } from "react";
import {
  Typography, Box, Button, TextField, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Snackbar, Alert, IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects, addProject, updateProject, deleteProject, clearStatus } from "./projectSlice";

export default function ProjectList() {
  const dispatch = useDispatch();
  const { projects, loading, error, success } = useSelector((s) => s.projects);
  const { role } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: '', description: '', memberUsernames: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => { dispatch(fetchProjects()); }, [dispatch]);

  const handleAdd = e => {
    e.preventDefault();
    if (!form.name) return;
    dispatch(addProject({
      ...form,
      memberUsernames: form.memberUsernames.split(",").map(s => s.trim()).filter(Boolean)
    })).then(action => {
      if (action.meta.requestStatus === "fulfilled") setForm({ name: '', description: '', memberUsernames: '' });
    });
  };

  const handleUpdate = e => {
    e.preventDefault();
    dispatch(updateProject({
      id: editId,
      ...form,
      memberUsernames: form.memberUsernames.split(",").map(s => s.trim()).filter(Boolean)
    })).then(action => {
      if (action.meta.requestStatus === "fulfilled") {
        setEditId(null);
        setForm({ name: '', description: '', memberUsernames: '' });
      }
    });
  };

  const handleEdit = p => {
    setEditId(p._id);
    setForm({
      name: p.name,
      description: p.description || '',
      memberUsernames: (p.members || []).map(u => u.username).join(", ")
    });
  };

  const handleDelete = id => {
    if (window.confirm("Delete this project?")) dispatch(deleteProject(id));
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>Projects</Typography>
      {(role === 'Admin' || role === 'Manager') && (
        <Box component="form" onSubmit={editId ? handleUpdate : handleAdd} sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField label="Name *" size="small" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <TextField label="Description" size="small" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <TextField label="Members: email,..." size="small" value={form.memberUsernames} onChange={e => setForm(f => ({ ...f, memberUsernames: e.target.value }))} />
          <Button type="submit" variant="contained">{editId ? "Save" : "Add Project"}</Button>
          {editId && <Button onClick={() => { setEditId(null); setForm({ name: '', description: '', memberUsernames: '' }) }}>Cancel</Button>}
        </Box>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Members</TableCell>
              {(role === "Admin" || role === "Manager") && <TableCell align="center">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && <TableRow><TableCell colSpan={5} align="center">Loading...</TableCell></TableRow>}
            {(!loading && projects && projects.length === 0) && <TableRow>
              <TableCell colSpan={5} align="center" style={{ opacity: 0.6 }}>No projects found.</TableCell>
            </TableRow>}
            {(!loading && projects && projects.length > 0) && projects.map(p => (
              <TableRow key={p._id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.description}</TableCell>
                <TableCell>{p.owner?.username}</TableCell>
                <TableCell>{(p.members||[]).map(u => u.username).join(", ")}</TableCell>
                {(role === "Admin" || role === "Manager") &&
                  <TableCell align="center">
                    <Button size="small" onClick={() => handleEdit(p)}>Edit</Button>
                    {role === "Admin" && (
                      <IconButton color="error" onClick={() => handleDelete(p._id)}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </TableCell>
                }
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {success && (
        <Snackbar open={!!success} autoHideDuration={3000} onClose={() => dispatch(clearStatus())}>
          <Alert severity="success" variant="filled">{success}</Alert>
        </Snackbar>
      )}
      {error && (
        <Snackbar open={!!error} autoHideDuration={3000} onClose={() => dispatch(clearStatus())}>
          <Alert severity="error" variant="filled">{error}</Alert>
        </Snackbar>
      )}
    </Box>
  );
}
