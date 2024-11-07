import { Add, Delete } from "@mui/icons-material";
import { IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { format, parse } from "date-fns";

const dateFormat = "dd/MM/yyyy";

const Todo = () => {
  const [newName, setNewName] = useState("");
  const [newDate, setNewDate] = useState(new Date());
  const [todos, setTodos] = useState([]);
  const handleDelete = (id) => {
    deleteDoc(doc(db, "todos", id));
    setTodos((old) =>
      old
        .map((item) => {
          if (id === item.id) return;
          return item;
        })
        .filter((item) => item)
    );
  };
  const handleAdd = async () => {
    if (newName === "") {
      return;
    }
    setTodos((old) => [{ name: newName, date: newDate }, ...old]);
    setNewDate(new Date());
    setNewName("");
    await addDoc(collection(db, "todos"), {
      name: newName,
      date: format(newDate, dateFormat),
    });
  };

  useEffect(() => {
    let proceed = true;
    const getTodos = async () => {
      const q = query(collection(db, "todos"));
      const allTodos = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const todo = doc.data();
        allTodos.push({
          name: todo.name,
          date: parse(todo.date, dateFormat, new Date()),
          id: doc.id,
        });
      });
      if (proceed) setTodos(allTodos);
    };
    getTodos();
    return () => (proceed = false);
  }, []);
  return (
    <Paper sx={{ p: 1 }}>
      <Stack gap={1}>
        <Stack direction="row" gap={1}>
          <TextField
            size="small"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <DatePicker
            size="small"
            value={newDate}
            inputFormat={dateFormat}
            onChange={(value) => {
              console.log(format(value, dateFormat));
              return setNewDate(value);
            }}
            slotProps={{
              textField: {
                size: "small",
                sx: { width: 150 },
              },
            }}
          />
          <IconButton color="info" onClick={handleAdd}>
            <Add />
          </IconButton>
        </Stack>
        {todos.map((todo, i) => {
          return (
            <Stack direction="row" gap={1} key={`${todo.name}${i}`}>
              <TextField disabled size="small" defaultValue={todo.name} />
              <DatePicker
                size="small"
                disabled
                defaultValue={todo.date}
                slotProps={{
                  textField: {
                    size: "small",
                    sx: { width: 150 },
                  },
                }}
              />
              <IconButton color="warning" onClick={() => handleDelete(todo.id)}>
                <Delete />
              </IconButton>
            </Stack>
          );
        })}

        <Typography>{`Celkem ${todos.length} todo`}</Typography>
      </Stack>
    </Paper>
  );
};

export default Todo;
