import { signInWithGoogle, signInWithGitHub } from "./authfunction/auth";

const SignupPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-700">
      <div className="w-full max-w-md p-6 bg-zinc-300 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Sign Up
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Join us with one of the options below!
        </p>
        <div className="space-y-4">
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
              alt="Google"
              className="w-5 h-5 mr-3"
            />
            Sign Up with Google
          </button>
          <button
            onClick={signInWithGitHub}
            className="w-full flex items-center justify-center p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
          >
            <img
              src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
              alt="GitHub"
              className="w-5 h-5 mr-3"
            />
            Sign Up with GitHub
          </button>
        </div>
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/signin" className="text-blue-500 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
