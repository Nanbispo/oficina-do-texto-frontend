import { useForm } from "react-hook-form";

type LoginFormData = {
    username: string;
    password: string;
};






export function LoginPage() {
    const { register, handleSubmit } = useForm<LoginFormData>();

    const onSubmit = (data: LoginFormData) => {
        console.log(data);
    };

    return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("username")}
        placeholder="Username"
      />

      <input
        {...register("password")}
        type="password"
        placeholder="Password"
      />

      <button type="submit">
        Entrar
      </button>
    </form>
  );
}

// import { useForm } from "react-hook-form";

// type LoginFormData = {
//   username: string;
//   password: string;
// };

// export function LoginPage() {
//   const { register, handleSubmit } =
//     useForm<LoginFormData>();

//   const onSubmit = (data: LoginFormData) => {
//     console.log(data);
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <input
//         {...register("username")}
//         placeholder="Username"
//       />

//       <input
//         {...register("password")}
//         type="password"
//         placeholder="Password"
//       />

//       <button type="submit">
//         Entrar
//       </button>
//     </form>
//   );
// }

