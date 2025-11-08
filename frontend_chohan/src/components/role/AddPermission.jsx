// import { Button, Card, Col, Row, Typography } from "antd";
// import { Fragment, useEffect, useState } from "react";
// import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
// import Loader from "../loader/loader";
// import { addPermission, loadPermission, loadSingleRole } from "./roleApis";
// import { deleteRolePermission } from "./roleApis";

// function PermissionList({ permissionNames, selectedPermission, setSelectedPermission }) {
// 	const permissionGroups = {};

// 	// Group permissions by MenuGroup -> MenuName
// 	permissionNames.forEach(item => {
// 		const group = item.MenuGroup;
// 		const menu = item.MenuName || item.name;
// 		if (group == null) return; // Skip null group

// 		if (!permissionGroups[group]) {
// 			permissionGroups[group] = {};
// 		}
// 		if (!permissionGroups[group][menu]) {
// 			permissionGroups[group][menu] = [];
// 		}
// 		permissionGroups[group][menu].push(item);
// 	});

// 	return (
// 		<div className="overflow-x-auto p-6">
// 			<table className="min-w-full border border-gray-300 rounded-lg shadow-md bg-white">
// 				<thead className="bg-green-600 text-white">
// 					<tr>
// 						<th className="border border-gray-300 px-6 py-3 text-center text-md font-semibold">MENU GROUP</th>
// 						<th className="border border-gray-300 px-6 py-3 text-center text-md font-semibold">MENU NAME</th>
// 						<th className="border border-gray-300 px-6 py-3 text-center text-md font-semibold">RIGHTS</th>
// 					</tr>
// 				</thead>
// 				<tbody>
// 					{Object.entries(permissionGroups).map(([menuGroup, menus]) =>
// 						Object.entries(menus).map(([menuName, rights], idx) => (
// 							<tr key={`${menuGroup}-${menuName}`} className="hover:bg-green-50">
// 								{idx === 0 && (
// 									<td
// 										className="border border-gray-300 px-4 py-4 text-center font-bold bg-gray-50"
// 										rowSpan={Object.keys(menus).length}
// 									>
// 										{menuGroup}
// 									</td>
// 								)}
// 								<td className="border border-gray-300 px-4 py-4 font-semibold text-center">{menuName}</td>
// 								<td className="border border-gray-300 px-4 py-4">
// 									<div className="flex flex-wrap gap-4 justify-center">
// 										{rights.map(item => (
// 											<Fragment key={item.id}>
// 												<label className="flex items-center gap-2 text-sm text-gray-700">
// 													<input
// 														type="checkbox"
// 														className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
// 														checked={selectedPermission[item.id] || false}
// 														onChange={() => {
// 															setSelectedPermission(prev => ({
// 																...prev,
// 																[item.id]: !prev[item.id],
// 															}));
// 														}}
// 													/>
// 													{item.ActionName || item.name}
// 												</label>
// 											</Fragment>
// 										))}
// 									</div>
// 								</td>
// 							</tr>
// 						))
// 					)}
// 				</tbody>
// 			</table>
// 		</div>
// 	);
// }

// const AddPermission = () => {
// 	const navigate = useNavigate();
// 	const { id } = useParams();

// 	const location = useLocation();
// 	console.log("page call", location);

// 	const passedRole = location.state?.data || null;  // <-- SAFE way

// 	const [permissions, setPermissions] = useState([]);
// 	const [selectedPermission, setSelectedPermission] = useState({});
// 	const [assignedPermissionIds, setAssignedPermissionIds] = useState([]);
// 	const [role, setRole] = useState(passedRole);   // <-- INIT with passed data
// 	const [loader, setLoader] = useState(false);

// 	const { Title } = Typography;

// 	useEffect(() => {
// 		console.log("passedRole", passedRole);

// 		const fetchData = async () => {
// 			try {
// 				// Fetch permissions and role data (if passedRole exists, skip API call for role)
// 				const [allPermissions, roleData] = await Promise.all([
// 					loadPermission(),
// 					passedRole
// 						? Promise.resolve({ data: passedRole }) // Use passedRole if available
// 						: loadSingleRole(id), // Fetch role if not passedRole
// 				]);

// 				// Update state with fetched data
// 				setPermissions(allPermissions);
// 				setRole(roleData.data);

// 				// Ensure rolePermissions exists before accessing it
// 				if (roleData.data?.rolePermissions) {
// 					const assignedIds = roleData.data.rolePermissions.map(rp => rp.permissionId);
// 					setAssignedPermissionIds(assignedIds);

// 					// Pre-select permissions
// 					const preSelected = allPermissions.reduce((acc, item) => {
// 						acc[item.id] = assignedIds.includes(item.id);
// 						return acc;
// 					}, {});
// 					setSelectedPermission(preSelected);
// 				}

// 			} catch (err) {
// 				console.error(err);
// 				toast.error("Failed to load permissions");
// 			}
// 		};

// 		// Fetch data when either 'id' or 'passedRole' changes
// 		fetchData();
// 	}, [id, passedRole]);

// 	const onSubmit = async () => {
// 		setLoader(true);

// 		try {
// 			const currentSelectedIds = Object.entries(selectedPermission)
// 				.filter(([_, value]) => value)
// 				.map(([key]) => Number(key));

// 			const assignedPermissions = role?.rolePermissions || [];
// 			const assignedPermissionIds = assignedPermissions.map(rp => rp.permissionId);

// 			// Compute added permissions (newly selected)
// 			const addedPermissions = currentSelectedIds.filter(id => !assignedPermissionIds.includes(id));

// 			// Compute removed permissions (unselected)
// 			const removedPermissionIds = assignedPermissionIds.filter(id => !currentSelectedIds.includes(id));

// 			// Now get rolePermission.id for removed ones
// 			const removedRolePermissionIds = assignedPermissions
// 				.filter(rp => removedPermissionIds.includes(rp.permissionId))
// 				.map(rp => rp.id);

// 			// If no changes
// 			if (addedPermissions.length === 0 && removedRolePermissionIds.length === 0) {
// 				toast.info("No changes detected.");
// 				setLoader(false);
// 				return;
// 			}

// 			// Handle addition
// 			if (addedPermissions.length > 0) {
// 				const payload = {
// 					roleId: parseInt(id),
// 					permissionId: addedPermissions,
// 				};
// 				const resp = await addPermission(payload);
// 				if (resp.message === "success") {
// 					toast.success("Added permissions successfully.");
// 				} else {
// 					toast.error("Failed to add permissions.");
// 				}
// 			}

// 			// Handle deletion
// 			if (removedRolePermissionIds.length > 0) {
// 				const resp = await deleteRolePermission(removedRolePermissionIds);
// 				if (resp.message === "success") {
// 					toast.success("Removed permissions successfully.");
// 				} else {
// 					toast.error("Failed to remove permissions.");
// 				}
// 			}

// 			navigate(-1);
// 		} catch (error) {
// 			console.error(error);
// 			toast.error("An unexpected error occurred.");
// 		} finally {
// 			setLoader(false);
// 		}
// 	};



// 	const isLogged = Boolean(localStorage.getItem("isLogged"));
// 	if (!isLogged) {
// 		return <Navigate to={"/admin/auth/login"} replace={true} />;
// 	}

// 	return (
// 		<UserPrivateComponent permission={"create-rolePermission"}>
// 			<Row className='mr-top' justify={"center"}>
// 				<Col xs={24} sm={24} md={24} lg={24} xl={24} className='border rounded column-design'>
// 					<Card bordered={false} className='criclebox h-full'>
// 						<Title level={3} className='m-3 text-center mb-5'>
// 							Add Permission : <span className='text-primary'>{role?.name}</span>
// 						</Title>

// 						{permissions.length > 0 && role ? (
// 							<>
// 								<PermissionList
// 									permissionNames={permissions}
// 									setSelectedPermission={setSelectedPermission}
// 									selectedPermission={selectedPermission}
// 								/>

// 								<div className='text-center'>
// 									<Button
// 										className='m-3 w-80'
// 										onClick={() => {
// 											onSubmit();
// 											// onDelete();
// 										}}
// 										type='primary'
// 										size='large'
// 										shape='round'
// 										loading={loader}>
// 										Permit Now
// 									</Button>
// 								</div>
// 							</>
// 						) : (
// 							<Loader />
// 						)}
// 					</Card>
// 				</Col>
// 			</Row>
// 		</UserPrivateComponent>
// 	);
// };

// export default AddPermission;



// src/components/AddPermission.jsx

// src/components/AddPermission.jsx

import { Button, Card, Col, Row, Typography } from "antd";
import { Fragment, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import UserPrivateComponent from "../PrivacyComponent/UserPrivateComponent";
import Loader from "../loader/loader";
import { addPermission, loadPermission, loadSingleRole, deleteRolePermission } from "./roleApis";

const { Title } = Typography;

// COMPONENT TO DISPLAY PERMISSION TABLE
function PermissionList({ permissionNames, selectedPermission, setSelectedPermission }) {
	const permissionGroups = {};

	// Group permissions by MenuGroup -> MenuName
	permissionNames.forEach(item => {
		const group = item.MenuGroup;
		const menu = item.MenuName || item.name;
		if (!group) return; // skip null

		if (!permissionGroups[group]) {
			permissionGroups[group] = {};
		}
		if (!permissionGroups[group][menu]) {
			permissionGroups[group][menu] = [];
		}
		permissionGroups[group][menu].push(item);
	});

	// Helper to compute row selection states
	const computeRowState = rights => {
		const total = rights.length;
		const selectedCount = rights.filter(item => selectedPermission[item.id]).length;

		return {
			checked: selectedCount === total,
			indeterminate: selectedCount > 0 && selectedCount < total,
		};
	};

	// Handle select/deselect all rights in a row
	const handleSelectAllRow = (rights, checked) => {
		const updated = { ...selectedPermission };
		rights.forEach(item => {
			updated[item.id] = checked;
		});
		setSelectedPermission(updated);
	};

	return (
		<div className="overflow-x-auto p-6">
			<table className="min-w-full border border-gray-300 rounded-lg shadow-md bg-white">
				<thead className="bg-[#1a1f71] text-white">
					<tr>
						<th className="border border-gray-300 px-6 py-3 text-center text-md font-semibold">MENU GROUP</th>
						<th className="border border-gray-300 px-6 py-3 text-center text-md font-semibold">MENU NAME</th>
						<th className="border border-gray-300 px-6 py-3 text-center text-md font-semibold">RIGHTS</th>
					</tr>
				</thead>
				<tbody>
					{Object.entries(permissionGroups).map(([menuGroup, menus]) =>
						Object.entries(menus).map(([menuName, rights], idx) => {
							const { checked, indeterminate } = computeRowState(rights);

							return (
								<tr key={`${menuGroup}-${menuName}`} className="hover:bg-green-50">
									{idx === 0 && (
										<td
											className="border border-gray-300 px-4 py-4 text-center font-bold bg-gray-50"
											rowSpan={Object.keys(menus).length}
										>
											{menuGroup}
										</td>
									)}
									<td className="border border-gray-300 px-4 py-4 font-semibold text-center">{menuName}</td>
									<td className="border border-gray-300 px-4 py-4">
										<div className="flex flex-col gap-2">
											{/* Select All Checkbox */}


											{/* Individual rights */}
											<div className="flex flex-wrap gap-4 justify-center">
												{rights.map(item => (
													<Fragment key={item.id}>
														<label className="flex items-center gap-2 text-sm text-gray-700">
															<input
																type="checkbox"
																className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
																checked={selectedPermission[item.id] || false}
																onChange={() => {
																	setSelectedPermission(prev => ({
																		...prev,
																		[item.id]: !prev[item.id],
																	}));
																}}
															/>
															{item.ActionName || item.name}
														</label>
													</Fragment>
												))}
												<label className="flex items-center gap-3 text-sm text-gray-700 font-semibold ml-12">
													<input
														type="checkbox"
														className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
														checked={checked}
														ref={el => {
															if (el) el.indeterminate = indeterminate;
														}}
														onChange={e => handleSelectAllRow(rights, e.target.checked)}
													/>
													<span className="text-green-700">Select All</span>
												</label>
											</div>
										</div>
									</td>
								</tr>
							);
						})
					)}
				</tbody>
			</table>
		</div>
	);
}

// MAIN COMPONENT
const AddPermission = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const location = useLocation();

	const passedRole = location.state?.data || null;
	const [permissions, setPermissions] = useState([]);
	const [selectedPermission, setSelectedPermission] = useState({});
	const [role, setRole] = useState(passedRole);
	const [loader, setLoader] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [allPermissions, roleData] = await Promise.all([
					loadPermission(),
					passedRole ? Promise.resolve({ data: passedRole }) : loadSingleRole(id),
				]);

				setPermissions(allPermissions);
				setRole(roleData.data);

				const assignedIds = roleData.data?.rolePermissions?.map(rp => rp.permissionId) || [];

				// Pre-select existing permissions
				const preSelected = allPermissions.reduce((acc, item) => {
					acc[item.id] = assignedIds.includes(item.id);
					return acc;
				}, {});
				setSelectedPermission(preSelected);

			} catch (err) {
				console.error(err);
				toast.error("Failed to load permissions");
			}
		};

		fetchData();
	}, [id, passedRole]);

	const onSubmit = async () => {
		setLoader(true);
		try {
			const currentSelectedIds = Object.entries(selectedPermission)
				.filter(([_, value]) => value)
				.map(([key]) => Number(key));

			const assignedPermissions = role?.rolePermissions || [];
			const assignedPermissionIds = assignedPermissions.map(rp => rp.permissionId);

			const addedPermissions = currentSelectedIds.filter(pid => !assignedPermissionIds.includes(pid));
			const removedPermissions = assignedPermissionIds.filter(pid => !currentSelectedIds.includes(pid));

			const removedRolePermissionIds = assignedPermissions
				.filter(rp => removedPermissions.includes(rp.permissionId))
				.map(rp => rp.id);

			if (addedPermissions.length === 0 && removedRolePermissionIds.length === 0) {
				toast.info("No changes detected.");
				setLoader(false);
				return;
			}

			// Handle addition
			if (addedPermissions.length > 0) {
				const payload = { roleId: parseInt(id), permissionId: addedPermissions };
				const resp = await addPermission(payload);
				if (resp.message === "success") {
					toast.success("Added permissions successfully.");
				} else {
					toast.error("Failed to add permissions.");
				}
			}

			// Handle deletion
			if (removedRolePermissionIds.length > 0) {
				const resp = await deleteRolePermission(removedRolePermissionIds);
				if (resp.message === "success") {
					toast.success("Removed permissions successfully.");
				} else {
					toast.error("Failed to remove permissions.");
				}
			}

			navigate(-1);
		} catch (err) {
			console.error(err);
			toast.error("An unexpected error occurred.");
		} finally {
			setLoader(false);
		}
	};

	const isLogged = Boolean(localStorage.getItem("isLogged"));
	if (!isLogged) {
		return <Navigate to={"/admin/auth/login"} replace={true} />;
	}

	return (
		<UserPrivateComponent permission={"create-rolePermission"}>
			<Row className='mr-top' justify='center'>
				<Col xs={24} sm={24} md={24} lg={24} xl={24} className='border rounded column-design'>
					<Card bordered={false} className='criclebox h-full'>
						<Title level={3} className='m-3 text-center mb-5'>
							Add Permission : <span className='text-primary'>{role?.name}</span>
						</Title>

						{permissions.length > 0 && role ? (
							<>
								<PermissionList
									permissionNames={permissions}
									selectedPermission={selectedPermission}
									setSelectedPermission={setSelectedPermission}
								/>
								<div className='text-center'>
									<Button
										className='m-3 w-80'
										onClick={onSubmit}
										type='primary'
										size='large'
										shape='round'
										loading={loader}
									>
										Permit Now
									</Button>
								</div>
							</>
						) : (
							<Loader />
						)}
					</Card>
				</Col>
			</Row>
		</UserPrivateComponent>
	);
};

export default AddPermission;
