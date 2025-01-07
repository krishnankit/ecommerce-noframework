import React from "react";

function Form({ children, onSubmit, title, submitText }) {
  return (
    <div className="flex justify-center align-center">
      <form
        action={ onSubmit }
        noValidate
        className="w-1/3 border border-gray rounded px-6 py-5"
      >
        <h3 className="text-2xl font-bold mb-3 text-center text-primary">
          { title }
        </h3>
        { children }
        <button
          type="submit"
          className="block mx-auto mt-4 px-3 py-1 rounded cursor-pointer bg-secondary text-white hover:bg-primary"
        >
          {submitText}
        </button>
      </form>
    </div>
  );
}

function FormControl({ children }) {
  return (
    <div className="w-full py-2">
      { children }
    </div>
  );
}

function FieldError({ message }) {
  return (
    <span className="block text-xs text-red">{message}</span>
  );
}

export { Form, FormControl, FieldError }
