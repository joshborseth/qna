import type { NextPage } from "next";
import { useRef, useState } from "react";
import { trpc } from "../utils/trpc";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const Home: NextPage = () => {
  const [parent] = useAutoAnimate<HTMLDivElement>();
  const utils = trpc.useContext();
  const createQuestion = trpc.useMutation(["question.createQuestion"], {
    onSuccess: () => {
      utils.invalidateQueries(["question.getAll"]);
    },
  });
  const deleteQuestion = trpc.useMutation(["question.deleteQuestion"], {
    onSuccess: () => {
      utils.invalidateQueries(["question.getAll"]);
    },
  });
  const questions = trpc.useQuery(["question.getAll"]);
  const titleRef = useRef<HTMLInputElement | null>(null);
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);

  const [modalToggle, setModalToggle] = useState<boolean>(false);
  return (
    <>
      <div className="w-screen h-screen flex justify-start items-center flex-col">
        <h1 className="p-20 text-4xl text-center">Question Board</h1>
        <button onClick={() => setModalToggle(true)} className="btn modal-button btn-secondary mb-20">
          Add Question
        </button>
        <input type="checkbox" id="my-modal" className="modal-toggle" checked={modalToggle ? true : false} />
        <div className="modal">
          <form
            className="w-2/3 flex justify-center items-center flex-col mx-auto gap-2 modal-box"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!titleRef.current?.value || !bodyRef.current?.value) return;
              createQuestion.mutate({
                title: titleRef.current.value,
                body: bodyRef.current.value,
                isAnswered: false,
              });
              titleRef.current.value = "";
              bodyRef.current.value = "";
              setModalToggle(false);
            }}
          >
            <label htmlFor="title">Title</label>
            <input className="text-black" type="text" id="title" name="title" ref={titleRef} />
            <label htmlFor="body">Question Body</label>
            <textarea id="body" name="body" className="text-black h-32 resize-none" ref={bodyRef} />
            <button type="submit" className="btn-primary btn my-5">
              Submit Question
            </button>
            <button onClick={() => setModalToggle(false)} className="btn absolute top-2 right-2 btn-square bg-error text-white hover:bg-error">
              X
            </button>
          </form>
        </div>
        <div className="w-2/3 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" ref={parent}>
          {questions.data &&
            questions.data.map((question) => (
              <article
                className="flex flex-col justify-center items-center bg-base-300 text-center text-neutral-content gap-10 px-3 py-10 relative rounded-xl"
                key={question.id}
              >
                <h2 className="text-2xl font-bold">{question.title}</h2>
                <p>{question.body}</p>
                <button
                  onClick={() => deleteQuestion.mutate(question.id)}
                  className="btn absolute -top-5 -right-5 btn-square bg-error text-white hover:bg-error"
                >
                  X
                </button>
              </article>
            ))}
        </div>
      </div>
    </>
  );
};

export default Home;
