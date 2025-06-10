"use client";
import { toast } from "react-hot-toast";

export const fetchOrganizations = async () => {
    try {
        const response = await fetch("/api/organization/getAllOrganization", {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch organizations");
        }

        const data = await response.json();

        return Array.isArray(data.entities)
            ? data.entities.map((org) => ({
                ...org,
                users: org.users || [],
                admins: org.admins || [],
            }))
            : [];
    } catch (error) {
        toast.error(`Error fetching organizations: ${error.message || "An unexpected error occurred"}`);
        return [];
    }
};

export const fetchAllUsers = async () => {
    try {
        const response = await fetch("/api/organization/getUser", {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Users");
        }

        const data = await response.json();
        return Array.isArray(data.entities)
            ? data.entities.map((org) => ({
                ...org,
                users: org.users || [],
                admins: org.admins || [],
            }))
            : [];
    } catch (error) {
        toast.error(`Error fetching Users: ${error.message || "An unexpected error occurred"}`);
        return [];
    }
};


export const fetchAllRole = async () => {
    try {
        const response = await fetch("/api/organization/fetchAllRole", {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Role");
        }

        const data = await response.json();

        return Array.isArray(data.entities)
            ? data.entities.map((org) => ({
                ...org,
                users: org.users || [],
                admins: org.admins || [],
            }))
            : [];
    } catch (error) {
        toast.error(`Error fetching Role: ${error.message || "An unexpected error occurred"}`);
        return [];
    }
};

export const getOrgOfSuperAdmin = async () => {
    try {
        const response = await fetch("/api/organization/getOrgOfSuperAdmin", {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Role");
        }
        const data = await response.json();
        return data
    } catch (error) {
        toast.error(`Error fetching Role: ${error.message || "An unexpected error occurred"}`);
        return [];
    }
};

export const addOrganization = (organizations, setOrganizations, organization) => {
    const newOrg = {
        ...organization,
        entity_uuid: organization.entity_uuid || Date.now().toString(),
        users: organization.users || [],
        admins: organization.admins || [],
    };
    setOrganizations([...organizations, newOrg]);
};

export const addUserOrAdmin = (organizations, setOrganizations, orgId, user) => {
    setOrganizations(
        organizations.map((org) =>
            org.entity_uuid === orgId
                ? {
                    ...org,
                    [user.role === "Admin" ? "admins" : "users"]: [
                        ...org[user.role === "Admin" ? "admins" : "users"],
                        user,
                    ],
                }
                : org
        )
    );
};