import Search from "../search/Search";
import UserList from "./user-list/UserList";
import PaginationComponent from "../pagination/PaginationComponent";
import { useState, useEffect } from "react";
import UserAdd from "./user-add/UserAdd";
import UserDetails from "./user-details/UserDetails";
import UserDelete from "./user-delete/UserDelete";

const baseUrl = "http://localhost:3030/jsonstore";

export default function UserSection(props) {
    const [users, setUsers] = useState([]);
    const [showAddUser, setShowAddUser] = useState(false);
    const [showUserDetailsById, setShowUserDetailsById] = useState(null);
    const [showUserDeleteById, setShowUserDeleteById] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [searchInput, setSearchInput] = useState("");
    const [filteredData, setFilteredData] = useState(users);

    useEffect(() => {
        (async function getUsers() {
            try {
                const response = await fetch(`${baseUrl}/users`);
                const result = await response.json();
                const users = Object.values(result);
                setUsers(users);
            } catch (error) {
                alert(error.message);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const addUserClickHandler = () => {
        setShowAddUser(true);
    };

    const addUserCloseHandler = () => {
        setShowAddUser(false);
    };

    const showUserInfoClickHandler = (userId) => {
        setShowUserDetailsById(userId);
    };

    const userDeleteClickHandler = (userId) => {
        setShowUserDeleteById(userId);
    };

    const addUserSaveHandler = async (e) => {
        //prevent refresh
        e.preventDefault();

        //start spinner
        // setIsLoading(true);

        //get user data
        const formData = new FormData(e.currentTarget);
        const userData = {
            ...Object.fromEntries(formData),
            createdAt: new Date().toISOString(),
            updateddAt: new Date().toISOString(),
        };

        //post request
        const response = await fetch(`${baseUrl}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        const addUser = await response.json();

        //update local state
        setUsers((oldUsers) => [...oldUsers, addUser]);

        //close modal
        setShowAddUser(false);

        //stop spinner
        // setIsLoading(false);
    };

    const userDeleteHandler = async (userId) => {
        //delete request server
        await fetch(`${baseUrl}/users`, {
            method: "DELETE",
        });

        //delete from local state
        setUsers((oldUsers) => oldUsers.filter((user) => user._id !== userId));

        //close modal
        setShowUserDeleteById(null);
    };

    const SearchHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const filtered = Object.fromEntries(formData);

        const searchValue = filtered.search;
        const criteria = filtered.criteria;
        
        try {
            const response = await fetch(`${baseUrl}/users`);
            const result = await response.json();
            const users = Object.values(result);
            const matched = users.filter((user) =>
                user.firstName.toLowerCase().includes(searchValue)
            );
            console.log(matched);
            
            setFilteredData(matched);
        } catch (error) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }


    };

    return (
        <section className="card users-container">
            <Search onSearch={SearchHandler} />

            <UserList
                users={users}
                isLoading={isLoading}
                onUserDetailsClick={showUserInfoClickHandler}
                onUserDeleteClick={userDeleteClickHandler}
            />

            {showAddUser && (
                <UserAdd
                    onClose={addUserCloseHandler}
                    onSave={addUserSaveHandler}
                />
            )}

            {showUserDetailsById && (
                <UserDetails
                    onClick={showUserInfoClickHandler}
                    onClose={() => setShowUserDetailsById(null)}
                    user={users.find(
                        (user) => user._id === showUserDetailsById
                    )}
                />
            )}

            {showUserDeleteById && (
                <UserDelete
                    onClose={() => setShowUserDeleteById(null)}
                    onUserDelete={() => userDeleteHandler(showUserDeleteById)}
                />
            )}

            <button className="btn-add btn" onClick={addUserClickHandler}>
                Add new user
            </button>

            <PaginationComponent />
        </section>
    );
}
