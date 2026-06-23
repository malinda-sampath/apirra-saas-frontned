{
  /* <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Welcome to APIRRA
        </h2>
        <UserInput
          label="Base URL"
          placeholder="Enter your base URL"
          className="mb-4"
          value={baseUrl}
          onChange={(e) => setBaseUrlState(e.target.value)}
        />
        <div className="flex space-x-4">
          <button
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => {
              // Handle login logic here
              setBaseUrlState(baseUrl);
              setBaseUrl(baseUrl); // Update the base URL in the API client
              handleApiSpecView();
              console.log("Base URL set to:", baseUrl);
            }}
          >
            {" "}
            View API Spec
          </button>
          <button
            className="w-full rounded-md px-4 py-2 text-sm font-medium text-black ring-1 ring-blue-700 ring-offset-1"
            onClick={() => {
              setSpecValue("");
              setBaseUrlState("");
            }}
          >
            Clear
          </button>
        </div>
        {specValue && (
          <div className="mt-6">
            <h3 className="mb-2 text-lg font-semibold text-gray-800">
              API Spec
            </h3>
            <textarea
              value={specValue}
              readOnly
              style={{
                width: "100%",
                height: "250px",
                fontFamily: "monospace",
              }}
            />
          </div> */
}
