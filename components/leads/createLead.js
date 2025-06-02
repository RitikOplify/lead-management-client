import React, { useRef, useState } from "react";
import { FaBars } from "react-icons/fa";
import Nav from "../Nav";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  asyncAddProducts,
  asyncCreateLeads,
  asyncGetAllLeads,
} from "@/store/actions/leads";
import { CustomSelectInput, Input, Select } from "../inputFields";
import { IoClose } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import axios from "@/utils/axios";
import {
  asyncAddCategory,
  asyncGetDealers,
  asyncGetExecutives,
} from "@/store/actions/admin";
import CreateLeadForm from "./CreateLeadForm";
const CreateLead = ({ leadId }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, touchedFields },
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      companyName: "",
      email: "",
      contact: "",
      enquiryType: "",
      source: "",
      city: "",
      state: "",
      price: "",
      comments: "",
      products: [],
      executiveId: "",
      dealerId: "",
    },
  });
  const searchParams = useSearchParams();
  const visitId = searchParams.get("visitId");
  console.log(visitId);

  const [visitDetails, setVisitDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const selectedExecutive = useWatch({ control, name: "executiveId" });
  const selectedDealer = useWatch({ control, name: "dealerId" });
  const [allProducts, setAllProducts] = useState([]);

  const dispatch = useDispatch();
  const { products, executives, dealers } = useSelector((state) => state.leads);
  const { user, currentCompany } = useSelector((state) => state.auth);
  const isEditMode = Boolean(leadId);
  console.log(dealers);

  useEffect(() => {
    async function getVisitDetails() {
      try {
        const { data } = await axios.get(`/visit/${visitId}`);
        setVisitDetails(data.visit);
        console.log(data?.visit);
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    }
    if (visitId) {
      getVisitDetails();
    }
  }, [visitId]);

  useEffect(() => {
    if (visitDetails) {
      reset({
        name: visitDetails.customerName || "",
        companyName: visitDetails.companyName || "",
      });
    }
  }, [visitDetails, reset]);

  useEffect(() => {
    if (user) {
      dispatch(asyncAddCategory());
      dispatch(asyncAddProducts());
      dispatch(asyncGetDealers());
      dispatch(asyncGetAllLeads());
      dispatch(asyncGetExecutives());
    }
  }, []);

  useEffect(() => {
    if (products) {
      setAllProducts(products || []);
    }
  }, [products]);

  const onSubmit = async (data) => {
    console.log(data);
    const leadData = { ...data, visitId, companyId: currentCompany.id };
    setLoading(true);
    if (isEditMode) {
      try {
        const { data } = await axios.put(`/lead/${leadId}`, leadData);
        console.log(data.lead);
      } catch (error) {
        console.log(error.response.data.message);
      }
    } else {
      await dispatch(asyncCreateLeads(leadData));
    }

    // reset();
    setLoading(false);
  };
  const [navOpen, setNavOpen] = useState(false);
  const [isProductOpen, setProductOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProduct = (products || []).filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const inputRef = useRef(null);

  useEffect(() => {
    if (isProductOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isProductOpen]);

  const productRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (productRef.current && !productRef.current.contains(event.target)) {
        setProductOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [searchLeadData, setSeachLeadData] = useState([]);
  const [query, setQuery] = useState("");

  const debounceTimeout = useRef(null);

  useEffect(() => {
    if (!query.trim()) return;

    // Only trigger if length is divisible by 3 or after 2 seconds
    if (query.trim().length % 3 === 0) {
      callSearchApi();
    } else {
      // Clear previous timeout
      clearTimeout(debounceTimeout.current);

      // Set new timeout
      debounceTimeout.current = setTimeout(() => {
        callSearchApi();
      }, 2000);
    }

    async function callSearchApi() {
      try {
        const { data } = await axios.post(`/lead/search`, { query });
        setSeachLeadData(data.leads);
        console.log(data.leads);
      } catch (error) {
        console.log(error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      }
    }

    // Cleanup timeout on unmount or query change
    return () => clearTimeout(debounceTimeout.current);
  }, [query]);

  useEffect(() => {
    if (isEditMode) {
      const getLeadDetails = async () => {
        try {
          const { data } = await axios.get(`/lead/${leadId}`);
          // setVisitDetails(data.visit);
          const products = data.lead.products.map((product) => product.id);
          reset({
            name: data.lead.name || "",
            companyName: data.lead.companyName || "",
            email: data.lead.email || "",
            contact: data.lead.contact || "",
            enquiryType: data.lead.enquiryType || "",
            source: data.lead.source || "",
            city: data.lead.city || "",
            state: data.lead.state || "",
            price: data.lead.price || "",
            comments: data.lead.comments || "",
            products: products || [],
            executiveId: data.lead.executiveId || "",
            dealerId: data.lead.dealerId || "",
          });
          console.log(data.lead.products);
        } catch (error) {
          toast.error(error?.response?.data?.message);
        }
      };
      getLeadDetails();
    }
  }, [isEditMode, leadId, reset]);

  return (
    <div className="flex h-screen">
      <Nav navOpen={navOpen} setNavOpen={setNavOpen} />
      <CreateLeadForm />
    </div>
  );
};

export default CreateLead;
