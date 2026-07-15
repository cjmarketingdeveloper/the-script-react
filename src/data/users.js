// src/data/users.js

export const Users = [
  {
    id: "usr_dev_111",
    fullName: "Ndiwanga Dev",
    phonenumber: "0821111111",
    email: "dev@platform.com",
    password: "password123",
    role: "Developer"
  },
  {
    id: "usr_des_222",
    fullName: "Tshepo Designer",
    phonenumber: "0822222222",
    email: "designer@platform.com",
    password: "password123",
    role: "Designer"
  },
  {
    id: "usr_eva_333",
    fullName: "Amu Evaluator",
    phonenumber: "0823333333",
    email: "evaluator@platform.com",
    password: "password123",
    role: "Evaluator"
  },
  {
    id: "usr_own_444",
    fullName: "Pharmacy Owner Joe",
    phonenumber: "0824444444",
    email: "owner@pharmacy.com",
    password: "password123",
    role: "Owner",
    practiceNumber: "PRAC-55589" // Anchors this pharmacy unit
  },
  {
    id: "usr_rep_555",
    fullName: "Field Rep Sarah",
    phonenumber: "0825555555",
    email: "rep@platform.com",
    password: "password123",
    role: "Rep",
    assignedPharmacies: ["PRAC-55589", "PRAC-12345"]
  },
  {
    id: "usr_stf_666",
    fullName: "Thabo Staff",
    phonenumber: "0826666666",
    email: "thabo@pharmacy.com",
    password: "password123",
    role: "Staff",
    practiceNumber: "PRAC-55589",
    tag: "Clerk"
  }
];