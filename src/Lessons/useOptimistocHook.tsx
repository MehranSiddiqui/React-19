import { useOptimistic, useState, useTransition } from "react";

const OptimisticHook = () => {
  const [todos, setTodos] = useState([]);
  const [optimisticTodo, setOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: string) => [...state, newTodo]
  );
  const [isPending, startTransition] = useTransition();
  const fakeAPI = async () => {
    // return new Promise((resolve) => {
    //   setTimeout(resolve, 2000);
    // });
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error("API Failed"));
      }, 2000);
    });
  };
  const addTodo = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault(); //prevents reload

    const formData = new FormData(e.currentTarget); //get all the values and name in the form
    const title = String(formData.get("name") || "").trim(); //what we require

    if (!title) return;

    startTransition(async () => {
      setOptimisticTodo(title);
      try {
        await fakeAPI();

        setTodos((prev) => [...prev, title]);
      } catch (error) {
        console.log(error);
      }
    });
  };
  return (
    <>
      <form className="column bottomSpacing" onSubmit={addTodo}>
        <input type="text" name="name" placeholder="Enter todo" />
        <button type="submit" className="counter">
          Submit
        </button>
      </form>
      {isPending ? (
        <span>Loading...</span>
      ) : (
        <ul>
          {todos?.map((item) => (
            <li>{item}</li>
          ))}
        </ul>
      )}
      <ol>
        {optimisticTodo.map((item) => (
          <li>{item}</li>
        ))}
      </ol>
    </>
  );
};

export default OptimisticHook;
