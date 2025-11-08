// ----------- procedures for inventoryOS--------------
const LOGIN_PROCEDURE = "[dbo].[sp_get_user_credentials]";
const GET_PARTY_PROCEDURE = "[dbo].[sp_get_party]";
const GET_CITY_PROCEDURE = "[dbo].[sp_get_city]";
const INSERT_OR_UPDATE_CITY_PROCEDURE = "[dbo].[sp_insert_or_update_city]";
const DELETE_PROCEDURE = "[dbo].[sp_delete_data]";
const INSERT_OR_UPDATE_PARTY_PROCEDURE = "[dbo].[sp_insert_or_update_party]";
const GET_STATE_PROCEDURE = "[dbo].[sp_get_states]";
const INSERT_OR_UPDATE_STATE_PROCEDURE = "[dbo].[sp_insert_or_update_state]";
const GET_VENDORS_PROCEDURE = "[dbo].[sp_get_vendors]";
const INSERT_OR_UPDATE_VENDOR_PROCEDURE = "[dbo].[sp_insert_or_update_vendor]";
const INSERT_OR_UPDATE_BUS_PROCEDURE = "[dbo].[sp_insert_or_update_bus]";
const GET_BUS_PROCEDURE = "[dbo].[sp_get_bus_data]";
const GET_BRANCH_PROCEDURE = "[dbo].[sp_get_branch_data]";
const INSERT_OR_UPDATE_BRANCH_PROCEDURE = "[dbo].[sp_insert_or_update_branch]";
const GET_DRIVER_PROCEDURE = "[dbo].[sp_get_driver_data]";

const INSERT_OR_UPDATE_DRIVER_PROCEDURE = "[dbo].[sp_insert_or_update_driver]";
const GET_HELPER_PROCEDURE = "[dbo].[sp_get_helper_data]";
const INSERT_OR_UPDATE_HELPER_PROCEDURE = "[dbo].[sp_insert_or_update_helper]";
const GET_PARTY_SITE_PROCEDURE = "[dbo].[sp_get_party_sites]";
const GET_PARTY_SITE_BY_USERID_PROCEDURE = "[dbo].[sp_get_party_sites_by_user]";
const INSERT_OR_UPDATE_SITE_PROCEDURE =
  "[dbo].[sp_insert_or_update_party_site]";
const GET_BUS_CATEGORY_PROCEDURE = "[dbo].[sp_get_bus_categories]";
const INSERT_OR_UPDATE_BUS_CATEGORY_PROCEDURE =
  "[dbo].[sp_insert_or_update_bus_category]";
const GET_SETUP_PROCEDURE = "[dbo].[sp_get_party_site_bus_setup]";
const INSERT_OR_UPDATE_SETUP_PROCEDURE =
  "[dbo].[sp_insert_or_update_party_site_bus_setup]";
const INSERT_OR_UPDATE_BOOKING_PROCEDURE =
  "[dbo].[sp_insert_or_update_booking_head]";
const GET_COMPANY_PROCEDURE = "[dbo].[sp_get_company]";
const INSERT_OR_UPDATE_COMPANY_PROCEDURE =
  "[dbo].[sp_insert_or_update_company]";
const GET_BOOKING_TRAN_PROCEDURE = "[dbo].[sp_get_booking_tran_data]";
const GET_BOOKING_TRAN_PROCEDURE_BY_DATE =
  "[dbo].[sp_get_daily_executions_data_by_date]";

const GET_FUEL_ENTRY_PROCEDURE = "[dbo].[sp_get_fuel_entry_data]";
const INSERT_OR_UPDATE_FUEL_ENTRY_PROCEDURE =
  "[dbo].[sp_insert_or_update_fuel_entry]";
const INSERT_OR_UPDATE_BOOKING_ENTRY_PROCEDURE =
  "[dbo].[sp_insert_or_update_booking_Entry]";
const DELETE_BOOKING_ENTRY_PROCEDURE = "[dbo].[sp_delete_booking]";
const GET_BOOKING_HEAD_PROCEDURE = "[dbo].[sp_get_booking_head_data]";
const GET_BOOKING_ALLOTMENT_PROCEDURE = "[dbo].[sp_get_booking_allotment_data]";
const INSERT_OR_UPDATE_BOOKING_ALLOTMENT_PROCEDURE =
  "[dbo].[sp_insert_or_update_booking_bus_allotment]";
const GET_PROFORMA_INV_PROCEDURE = "[dbo].[sp_get_proforma_invoice_data]";
const GET_PROFORMA_INV_PROCEDURE_BY_PARTY =
  "[dbo].[sp_get_proforma_invoice_data_by_partyname]";

const INSERT_OR_UPDATE_PROFORMA_INVOICE_PROCEDURE =
  "[dbo].[sp_insert_or_update_proforma_Entry]";
const CHECK_BUS_STOCK = "[dbo].[sp_get_vehicle_stock]";
const GET_DIALY_EXECUTIONS_PROCEDURE = "[dbo].[sp_get_daily_executions_data]";
const INSERT_OR_UPDATE_DAILY_EXECUTIONS_PROCEDURE =
  "[dbo].[sp_insert_or_update_daily_execution]";
const INSERT_OR_UPDATE_ATTENDANCE_PROCEDURE =
  "[dbo].[sp_insert_driver_helper_attendance]";
const GET_ATTENDANCE_PROCEDURE = "[dbo].[sp_get_driver_helper_attendance_data]";
const GET_ADVANCE_TO_STAFF_PROCEDURE = "[dbo].[sp_get_advance_to_staff_data]";
const GET_Single_ADVANCE_TO_STAFF_PROCEDURE =
  "[dbo].[sp_get_advance_to_staff_data_advanceNo]";
const GET_Single_ADVANCE_TO_STAFF_BY_TYPE_PROCEDURE =
  "[dbo].[sp_get_advance_to_staff_data_by_type]";
const INSERT_OR_UPDATE_ADVANCE_TO_STAFF_PROCEDURE =
  "[dbo].[sp_insert_update_advance_to_staff_entry]";
const GET_ALL_ADVANCE_PROCEDURE = "[dbo].[sp_get_all_advance_data]";
const GET_SALARY_SET_UP = "[dbo].[sp_get_salary_setup]";
const INSERT_OR_UPDATE_SALATY_SET_UP = "[dbo].[sp_insert_update_salary_set_up]";
const INSERT_INVOICE_TRANSFER = "[dbo].[sp_transfer_performa_invoice]";
const GET_SALARY_SET_UP_BY_ID = "[dbo].[sp_get_salary_setup_by_id]";
const GET_INVOICE_DATA = "[dbo].[sp_get_invoice_data]";
const INSERT_INVOICE_ENTRY = "[dbo].[sp_insert_or_update_invoice_Entry]";
const GET_INVOICE_ENTRT_BOOKING = "[dbo].[sp_get_data_booking_transfer]";
const UPDATE_INVOICE_ENTRY_BOOKING = "[dbo].[sp_update_invoice_booking]";
const GET_BUS_REPAIR = "[dbo].[sp_get_busrepair]";
const GET_BUS_REPAIR_BY_ID = "[dbo].[sp_get_busrepair_by_id]";
const INSERT_BUS_REPAIR_ENTRY = "[dbo].[sp_insert_bus_repair]";
const DELETE_ADVANCE_TO_STAFF = "[dbo].[sp_delete_advancetostaff]";
const INSERT_BUS_PARTS = "[dbo].[sp_insert_bus_parts]";
const GET_BUS_PARTS = "[dbo].[sp_get_parts]";
const INSERT_OR_UPDATE_STAFF = "[dbo].[sp_insert_or_update_staff]";
const GET_STAFF_DATA = "[dbo].[sp_get_staff_data]";
const GET_STAFF_ATTENDENCE = "[dbo].[sp_get_staff_attendance_data]";
const INSERT_STAFF_ATTENDENCE = "[dbo].[sp_insert_staff_attendance]";
const GET_ALL_BUS_REPAIR = "[dbo].[sp_get_busrepair_all]";
const GET_SALARY_PROCESS_DETL = "[dbo].[sp_get_salary_detals]";
const INSERT_UPDATE_SALARY_PROCESS = "[dbo].[sp_insert_update_salary_details]";
const GET_SALARY_DETL_BY_TYPE_ID = "[dbo].[sp_get_advance_to_staff_by_id]";
const GET_ATTENDANCE_PROCEDURE_BY_MONTH = "[dbo].[sp_get_monthly_attandance]";
const GET_SALARY_DETL_BY_TYPE_ID2 = "[dbo].[sp_get_salary_detals_by_id]";
const GET_BUS_DOCUMENTS_DETALS = "[dbo].[sp_get_bus_documents]";
const INSERT_BUS_DOCUMENTS = "[dbo].[sp_insert_bus_documents_detals]";
const INSERT_SALARY_ADJUST = "[dbo].[sp_insert_Salary_AdvAdjDetl]";
const GET_USER = "[dbo].[sp_get_user]";
const INSERT_UPDATE_USER = "[dbo].[sp_insert_or_update_user]";
const MANAGE_ROLE = "[dbo].[sp_manage_role]";
const DELETE_BOOKING_TRAN = "[dbo].[sp_delete_booking_tran]";
const DELETE_PROFORMAINVOICE_TRAN = "[dbo].[sp_delete_proforma]";
const GET_ALL_PANDING_DOCUMENTS = "[dbo].[sp_get_bus_documents_json]";
const GET_BUS_STOCK = "[dbo].[sp_Get_BusStock]";
const GET_ALL_BOOKING_SAMARY = "[dbo].[sp_get_booking_summary]";
const GET_ALL_EXPIRED_DOCUMENTS = "[dbo].[sp_GetExpiringBusDocuments]";
const sp_insert_drv_helper_site_attend_json =
  "[dbo].[sp_insert_drv_helper_site_attend_json]";
const sp_save_salary_details = "[dbo].[sp_save_salary_details]";
const sp_get_salary = "[dbo].[spGet_Salarydetails]";

module.exports = {
  sp_get_salary,
  sp_save_salary_details,
  sp_insert_drv_helper_site_attend_json,
  GET_ALL_EXPIRED_DOCUMENTS,
  GET_ALL_BOOKING_SAMARY,
  GET_BUS_STOCK,
  GET_ALL_PANDING_DOCUMENTS,
  LOGIN_PROCEDURE,
  GET_PARTY_PROCEDURE,
  GET_CITY_PROCEDURE,
  INSERT_OR_UPDATE_CITY_PROCEDURE,
  DELETE_PROCEDURE,
  INSERT_OR_UPDATE_PARTY_PROCEDURE,
  GET_STATE_PROCEDURE,
  INSERT_OR_UPDATE_STATE_PROCEDURE,
  GET_VENDORS_PROCEDURE,
  INSERT_OR_UPDATE_VENDOR_PROCEDURE,
  INSERT_OR_UPDATE_BUS_PROCEDURE,
  GET_BUS_PROCEDURE,
  GET_BRANCH_PROCEDURE,
  INSERT_OR_UPDATE_BRANCH_PROCEDURE,
  GET_DRIVER_PROCEDURE,
  INSERT_OR_UPDATE_DRIVER_PROCEDURE,
  GET_HELPER_PROCEDURE,
  INSERT_OR_UPDATE_HELPER_PROCEDURE,
  GET_PARTY_SITE_PROCEDURE,
  GET_PARTY_SITE_BY_USERID_PROCEDURE,
  INSERT_OR_UPDATE_SITE_PROCEDURE,
  GET_BUS_CATEGORY_PROCEDURE,
  INSERT_OR_UPDATE_BUS_CATEGORY_PROCEDURE,
  GET_SETUP_PROCEDURE,
  INSERT_OR_UPDATE_SETUP_PROCEDURE,
  INSERT_OR_UPDATE_BOOKING_PROCEDURE,
  GET_COMPANY_PROCEDURE,
  INSERT_OR_UPDATE_COMPANY_PROCEDURE,
  GET_BOOKING_TRAN_PROCEDURE,
  GET_FUEL_ENTRY_PROCEDURE,
  INSERT_OR_UPDATE_FUEL_ENTRY_PROCEDURE,
  INSERT_OR_UPDATE_BOOKING_ENTRY_PROCEDURE,
  DELETE_BOOKING_ENTRY_PROCEDURE,
  GET_BOOKING_HEAD_PROCEDURE,
  GET_BOOKING_ALLOTMENT_PROCEDURE,
  INSERT_OR_UPDATE_BOOKING_ALLOTMENT_PROCEDURE,
  INSERT_OR_UPDATE_PROFORMA_INVOICE_PROCEDURE,
  GET_PROFORMA_INV_PROCEDURE,
  CHECK_BUS_STOCK,
  GET_DIALY_EXECUTIONS_PROCEDURE,
  INSERT_OR_UPDATE_DAILY_EXECUTIONS_PROCEDURE,
  INSERT_OR_UPDATE_ATTENDANCE_PROCEDURE,
  GET_ATTENDANCE_PROCEDURE,
  GET_ADVANCE_TO_STAFF_PROCEDURE,
  INSERT_OR_UPDATE_ADVANCE_TO_STAFF_PROCEDURE,
  GET_BOOKING_TRAN_PROCEDURE_BY_DATE,
  GET_SALARY_SET_UP,
  INSERT_OR_UPDATE_SALATY_SET_UP,
  GET_ALL_ADVANCE_PROCEDURE,
  INSERT_INVOICE_TRANSFER,
  GET_Single_ADVANCE_TO_STAFF_PROCEDURE,
  GET_SALARY_SET_UP_BY_ID,
  GET_PROFORMA_INV_PROCEDURE_BY_PARTY,
  GET_INVOICE_DATA,
  INSERT_INVOICE_ENTRY,
  GET_INVOICE_ENTRT_BOOKING,
  UPDATE_INVOICE_ENTRY_BOOKING,
  GET_BUS_REPAIR,
  INSERT_BUS_REPAIR_ENTRY,
  DELETE_ADVANCE_TO_STAFF,
  INSERT_BUS_PARTS,
  GET_BUS_PARTS,
  INSERT_OR_UPDATE_STAFF,
  GET_STAFF_DATA,
  INSERT_STAFF_ATTENDENCE,
  GET_STAFF_ATTENDENCE,
  GET_ALL_BUS_REPAIR,
  INSERT_UPDATE_SALARY_PROCESS,
  GET_SALARY_PROCESS_DETL,
  GET_SALARY_DETL_BY_TYPE_ID,
  GET_ATTENDANCE_PROCEDURE_BY_MONTH,
  GET_SALARY_DETL_BY_TYPE_ID2,
  INSERT_BUS_DOCUMENTS,
  GET_BUS_DOCUMENTS_DETALS,
  INSERT_SALARY_ADJUST,
  GET_BUS_REPAIR_BY_ID,
  GET_Single_ADVANCE_TO_STAFF_BY_TYPE_PROCEDURE,
  GET_USER,
  INSERT_UPDATE_USER,
  MANAGE_ROLE,
  DELETE_BOOKING_TRAN,
  DELETE_PROFORMAINVOICE_TRAN,
};
