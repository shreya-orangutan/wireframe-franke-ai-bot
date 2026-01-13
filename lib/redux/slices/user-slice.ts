import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { User } from "@/lib/schemas"

interface UserState {
  users: User[]
  filteredUsers: User[]
  selectedUser: User | null
}

// Mock data for demo
const mockUsers: User[] = [
  {
    id: "u1",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@company.com",
    password: "hashed_password_1",
    role: "Trainer",
    contactNumber: "+91-9876543210",
    country: "India",
    region: "Tamil Nadu",
    isLocked: false,
    lastLogin: "2026-01-08T14:30:00",
    preferredTheme: "light",
    preferredLanguage: "Tamil",
    preferredRegion: "Tamil Nadu",
    createdBy: "Admin",
    isActive: true,
    userType: "Full-time",
    reportingManager: "John Doe",
    joiningDate: "2025-06-15",
    isUserVerified: true,
    department: "Training",
    employeeCode: "EMP001",
    createdAt: "2025-06-15T10:00:00",
    updatedAt: "2026-01-08T14:30:00",
  },
  {
    id: "u2",
    name: "Priya Singh",
    email: "priya.singh@company.com",
    password: "hashed_password_2",
    role: "Trainee",
    contactNumber: "+91-9876543211",
    country: "India",
    region: "Gujarat",
    isLocked: false,
    lastLogin: "2026-01-07T10:15:00",
    preferredTheme: "dark",
    preferredLanguage: "Hindi",
    preferredRegion: "Gujarat",
    createdBy: "Admin",
    isActive: true,
    userType: "Part-time",
    reportingManager: "Rajesh Kumar",
    joiningDate: "2025-08-20",
    isUserVerified: true,
    department: "Operations",
    employeeCode: "EMP002",
    createdAt: "2025-08-20T09:30:00",
    updatedAt: "2026-01-07T10:15:00",
  },
  {
    id: "u3",
    name: "Amit Patel",
    email: "amit.patel@company.com",
    password: "hashed_password_3",
    role: "Trainer",
    contactNumber: "+91-9876543212",
    country: "India",
    region: "Karnataka",
    isLocked: true,
    lastLogin: "2025-12-20T16:45:00",
    preferredTheme: "light",
    preferredLanguage: "Kannada",
    preferredRegion: "Karnataka",
    createdBy: "Admin",
    isActive: false,
    userType: "Full-time",
    reportingManager: "Sarah Johnson",
    joiningDate: "2025-04-10",
    isUserVerified: false,
    department: "Training",
    employeeCode: "EMP003",
    createdAt: "2025-04-10T11:00:00",
    updatedAt: "2026-01-05T08:00:00",
  },
  {
    id: "u4",
    name: "Sneha Desai",
    email: "sneha.desai@company.com",
    password: "hashed_password_4",
    role: "Trainee",
    contactNumber: "+91-9876543213",
    country: "India",
    region: "West Bengal",
    isLocked: false,
    lastLogin: "2026-01-08T11:20:00",
    preferredTheme: "light",
    preferredLanguage: "Bengali",
    preferredRegion: "West Bengal",
    createdBy: "Admin",
    isActive: true,
    userType: "Full-time",
    reportingManager: "Priya Singh",
    joiningDate: "2025-09-05",
    isUserVerified: true,
    department: "Support",
    employeeCode: "EMP004",
    createdAt: "2025-09-05T13:45:00",
    updatedAt: "2026-01-08T11:20:00",
  },
]

const initialState: UserState = {
  users: mockUsers,
  filteredUsers: mockUsers,
  selectedUser: null,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload
      state.filteredUsers = action.payload
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload)
      state.filteredUsers = state.users
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex((u) => u.id === action.payload.id)
      if (index !== -1) {
        state.users[index] = action.payload
        state.filteredUsers = state.users
      }
      if (state.selectedUser?.id === action.payload.id) {
        state.selectedUser = action.payload
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((u) => u.id !== action.payload)
      state.filteredUsers = state.users
    },
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload
    },
    filterUsers: (state, action: PayloadAction<string>) => {
      const searchTerm = action.payload.toLowerCase()
      state.filteredUsers = state.users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm) ||
          user.employeeCode.toLowerCase().includes(searchTerm),
      )
    },
  },
})

export const { setUsers, addUser, updateUser, deleteUser, setSelectedUser, filterUsers } = userSlice.actions
export default userSlice.reducer
