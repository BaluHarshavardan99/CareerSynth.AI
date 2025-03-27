import { configureStore, createSlice } from "@reduxjs/toolkit";

// Create a slice for job input and resume file
const jobSlice = createSlice({
  name: "job",
  initialState: {
    jobInputType: "url",
    jobInput: "",
    resumeFile: null, // Store the entire file
    parsedResumeText: "", // Store the parsed text
  },
  reducers: {
    setJobInputType: (state, action) => {
      state.jobInputType = action.payload;
    },
    setJobInput: (state, action) => {
      state.jobInput = action.payload;
    },
    setResumeFile: (state, action) => {
      state.resumeFile = action.payload; // Store the entire file object
    },
    setParsedResumeText: (state, action) => {
      state.parsedResumeText = action.payload; // Store the parsed text
    },
  },
});

export const { setJobInputType, setJobInput, setResumeFile, setParsedResumeText } = jobSlice.actions;

const store = configureStore({
  reducer: {
    job: jobSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these paths from serializability checks
        ignoredPaths: ["job.resumeFile"],
        ignoredActions: ["job/setResumeFile"],
      },
    }),
});

export default store;
