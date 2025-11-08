BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Account] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [Account_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[AdjustInvoice] (
    [id] INT NOT NULL IDENTITY(1,1),
    [note] NVARCHAR(1000),
    [userId] INT NOT NULL,
    [date] DATETIME2 NOT NULL CONSTRAINT [AdjustInvoice_date_df] DEFAULT CURRENT_TIMESTAMP,
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [AdjustInvoice_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[AdjustInvoiceProduct] (
    [id] INT NOT NULL IDENTITY(1,1),
    [adjustInvoiceId] INT NOT NULL,
    [productId] INT,
    [adjustQuantity] INT NOT NULL,
    [adjustType] NVARCHAR(1000),
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [AdjustInvoiceProduct_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[AppSetting] (
    [id] INT NOT NULL IDENTITY(1,1),
    [companyName] NVARCHAR(1000) NOT NULL,
    [tagLine] NVARCHAR(1000) NOT NULL,
    [address] NVARCHAR(1000) NOT NULL,
    [phone] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [website] NVARCHAR(1000) NOT NULL,
    [footer] NVARCHAR(1000) NOT NULL,
    [logo] NVARCHAR(1000),
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [AppSetting_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Color] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [colorCode] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Color_status_df] DEFAULT 'true',
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [Color_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Coupon] (
    [id] INT NOT NULL IDENTITY(1,1),
    [couponCode] NVARCHAR(1000),
    [type] NVARCHAR(1000) NOT NULL CONSTRAINT [Coupon_type_df] DEFAULT 'percentage',
    [value] FLOAT(53) NOT NULL,
    [startDate] DATETIME2 NOT NULL,
    [endDate] DATETIME2 NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Coupon_status_df] DEFAULT 'true',
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [Coupon_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Customer] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [phone] NVARCHAR(1000),
    [address] NVARCHAR(1000),
    [password] NVARCHAR(1000),
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Customer_status_df] DEFAULT 'true',
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [Customer_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[CustomerPermissions] (
    [id] INT NOT NULL IDENTITY(1,1),
    [user] NVARCHAR(1000) NOT NULL,
    [permissions] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [CustomerPermissions_status_df] DEFAULT 'true',
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [CustomerPermissions_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Designation] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Designation_status_df] DEFAULT 'true',
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [Designation_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Email] (
    [id] INT NOT NULL IDENTITY(1,1),
    [senderEmail] NVARCHAR(1000) NOT NULL,
    [receiverEmail] NVARCHAR(1000) NOT NULL,
    [subject] NVARCHAR(1000),
    [body] NVARCHAR(1000),
    [emailStatus] NVARCHAR(1000),
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Email_status_df] DEFAULT 'true',
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [Email_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[EmailConfig] (
    [id] INT NOT NULL IDENTITY(1,1),
    [emailConfigName] NVARCHAR(1000) NOT NULL,
    [emailHost] NVARCHAR(1000) NOT NULL,
    [emailPort] NVARCHAR(1000) NOT NULL,
    [emailUser] NVARCHAR(1000) NOT NULL,
    [emailPass] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [EmailConfig_status_df] DEFAULT 'true',
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [EmailConfig_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Migration] (
    [id] INT NOT NULL,
    [migration] NVARCHAR(1000) NOT NULL,
    [batch] INT NOT NULL,
    CONSTRAINT [Migration_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[PageSize] (
    [id] INT NOT NULL IDENTITY(1,1),
    [pageSizeName] NVARCHAR(1000) NOT NULL,
    [width] FLOAT(53) NOT NULL,
    [height] FLOAT(53) NOT NULL,
    [unit] NVARCHAR(1000) NOT NULL CONSTRAINT [PageSize_unit_df] DEFAULT 'inches',
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [PageSize_status_df] DEFAULT 'true',
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [PageSize_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Permission] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [Permission_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[PersonalAccessToken] (
    [id] INT NOT NULL IDENTITY(1,1),
    [tokenable_type] NVARCHAR(1000) NOT NULL,
    [tokenable_id] INT NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [token] NVARCHAR(1000) NOT NULL,
    [abilities] NVARCHAR(1000),
    [last_used_at] DATETIME2,
    [expires_at] DATETIME2,
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [PersonalAccessToken_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Product] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [productThumbnailImage] NVARCHAR(1000),
    [productSubCategoryId] INT,
    [productBrandId] INT,
    [description] NVARCHAR(1000),
    [sku] NVARCHAR(1000),
    [productQuantity] INT NOT NULL,
    [productSalePrice] FLOAT(53) NOT NULL,
    [productPurchasePrice] FLOAT(53) NOT NULL,
    [unitType] NVARCHAR(1000),
    [unitMeasurement] FLOAT(53),
    [reorderQuantity] INT,
    [productVat] FLOAT(53),
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Product_status_df] DEFAULT 'true',
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    [purchaseInvoiceId] INT,
    CONSTRAINT [Product_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ProductBrand] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [ProductBrand_status_df] DEFAULT 'true',
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [ProductBrand_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ProductCategory] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [ProductCategory_status_df] DEFAULT 'true',
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [ProductCategory_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ProductVariant] (
    [id] INT NOT NULL IDENTITY(1,1),
    [productId] INT NOT NULL,
    [sizeId] INT NOT NULL,
    [colorId] INT,
    [primaryImage] NVARCHAR(1000),
    [variantPrice] FLOAT(53) NOT NULL CONSTRAINT [ProductVariant_variantPrice_df] DEFAULT 0,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [ProductVariant_status_df] DEFAULT 'true',
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [ProductVariant_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ProductVariantImageOrVideo] (
    [id] INT NOT NULL IDENTITY(1,1),
    [productId] INT NOT NULL,
    [variantId] INT NOT NULL,
    [media] NVARCHAR(1000),
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [ProductVariantImageOrVideo_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Size] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [Size_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ProductSubCategory] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [productCategoryId] INT,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [ProductSubCategory_status_df] DEFAULT 'true',
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [ProductSubCategory_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ProductTax] (
    [id] INT NOT NULL IDENTITY(1,1),
    [sku] NVARCHAR(1000) NOT NULL,
    [sgst] INT NOT NULL,
    [igst] INT NOT NULL,
    [cgst] INT NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [ProductTax_status_df] DEFAULT 'true',
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [ProductTax_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [ProductTax_sku_key] UNIQUE NONCLUSTERED ([sku])
);

-- CreateTable
CREATE TABLE [dbo].[PurchaseInvoice] (
    [id] INT NOT NULL IDENTITY(1,1),
    [date] DATETIME2 NOT NULL,
    [totalAmount] FLOAT(53) NOT NULL,
    [discount] FLOAT(53) NOT NULL,
    [paidAmount] FLOAT(53) NOT NULL,
    [dueAmount] FLOAT(53) NOT NULL,
    [supplierId] INT NOT NULL,
    [note] NVARCHAR(1000),
    [supplierMemoNo] NVARCHAR(1000),
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [PurchaseInvoice_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[PurchaseInvoiceProduct] (
    [id] INT NOT NULL IDENTITY(1,1),
    [invoiceId] INT NOT NULL,
    [productId] INT,
    [productQuantity] INT NOT NULL,
    [productPurchasePrice] FLOAT(53) NOT NULL,
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [PurchaseInvoiceProduct_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[PurchaseReorderInvoice] (
    [id] INT NOT NULL IDENTITY(1,1),
    [reorderInvoiceId] NVARCHAR(1000) NOT NULL,
    [productId] INT NOT NULL,
    [productQuantity] INT NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [PurchaseReorderInvoice_status_df] DEFAULT 'true',
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [PurchaseReorderInvoice_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Quote] (
    [id] INT NOT NULL IDENTITY(1,1),
    [quoteOwnerId] INT NOT NULL,
    [quoteName] NVARCHAR(1000) NOT NULL,
    [quoteDate] DATETIME2,
    [expirationDate] DATETIME2,
    [termsAndConditions] NVARCHAR(1000),
    [description] NVARCHAR(1000),
    [discount] FLOAT(53),
    [totalAmount] FLOAT(53),
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Quote_status_df] DEFAULT 'true',
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [Quote_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[QuoteProduct] (
    [id] INT NOT NULL IDENTITY(1,1),
    [quoteId] INT NOT NULL,
    [productId] INT NOT NULL,
    [unitPrice] FLOAT(53) NOT NULL,
    [productQuantity] INT NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [QuoteProduct_status_df] DEFAULT 'true',
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [QuoteProduct_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ReturnPurchaseInvoice] (
    [id] INT NOT NULL IDENTITY(1,1),
    [date] DATETIME2 NOT NULL,
    [totalAmount] FLOAT(53) NOT NULL,
    [note] NVARCHAR(1000),
    [purchaseInvoiceId] INT NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [ReturnPurchaseInvoice_status_df] DEFAULT 'true',
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [ReturnPurchaseInvoice_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ReturnPurchaseInvoiceProduct] (
    [id] INT NOT NULL IDENTITY(1,1),
    [invoiceId] INT NOT NULL,
    [productId] INT,
    [productQuantity] INT NOT NULL,
    [productPurchasePrice] FLOAT(53) NOT NULL,
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [ReturnPurchaseInvoiceProduct_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ReturnSaleInvoice] (
    [id] INT NOT NULL IDENTITY(1,1),
    [date] DATETIME2 NOT NULL,
    [totalAmount] FLOAT(53) NOT NULL,
    [note] NVARCHAR(1000),
    [saleInvoiceId] INT NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [ReturnSaleInvoice_status_df] DEFAULT 'true',
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [ReturnSaleInvoice_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ReturnSaleInvoiceProduct] (
    [id] INT NOT NULL IDENTITY(1,1),
    [invoiceId] INT NOT NULL,
    [productId] INT,
    [productQuantity] INT NOT NULL,
    [productSalePrice] FLOAT(53) NOT NULL,
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [ReturnSaleInvoiceProduct_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ReviewRating] (
    [id] INT NOT NULL IDENTITY(1,1),
    [rating] INT NOT NULL,
    [review] NVARCHAR(1000),
    [productId] INT,
    [customerId] INT NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [ReviewRating_status_df] DEFAULT 'true',
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [ReviewRating_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Role] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Role_status_df] DEFAULT 'true',
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [Role_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[RolePermission] (
    [id] INT NOT NULL IDENTITY(1,1),
    [roleId] INT NOT NULL,
    [permissionId] INT NOT NULL,
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [RolePermission_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[SaleInvoice] (
    [id] INT NOT NULL IDENTITY(1,1),
    [date] DATETIME2 NOT NULL,
    [totalAmount] FLOAT(53) NOT NULL,
    [discount] FLOAT(53) NOT NULL,
    [paidAmount] FLOAT(53) NOT NULL,
    [dueAmount] FLOAT(53) NOT NULL,
    [profit] FLOAT(53) NOT NULL,
    [customerId] INT NOT NULL,
    [userId] INT NOT NULL,
    [note] NVARCHAR(1000),
    [address] NVARCHAR(1000),
    [orderStatus] NVARCHAR(1000) NOT NULL CONSTRAINT [SaleInvoice_orderStatus_df] DEFAULT 'pending',
    [isHold] NVARCHAR(1000) NOT NULL CONSTRAINT [SaleInvoice_isHold_df] DEFAULT 'false',
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [SaleInvoice_status_df] DEFAULT 'true',
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [SaleInvoice_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[SaleInvoiceProduct] (
    [id] INT NOT NULL IDENTITY(1,1),
    [productId] INT NOT NULL,
    [invoiceId] INT NOT NULL,
    [productQuantity] INT NOT NULL,
    [productSalePrice] FLOAT(53) NOT NULL,
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [SaleInvoiceProduct_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[SaleInvoiceVat] (
    [id] INT NOT NULL IDENTITY(1,1),
    [invoiceId] INT NOT NULL,
    [productVatId] INT NOT NULL,
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [SaleInvoiceVat_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Shift] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [startTime] DATETIME2,
    [endTime] DATETIME2,
    [workHour] FLOAT(53),
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Shift_status_df] DEFAULT 'true',
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [Shift_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[SubAccount] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [accountId] INT NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [SubAccount_status_df] DEFAULT 'true',
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [SubAccount_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Supplier] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [phone] NVARCHAR(1000) NOT NULL,
    [address] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Supplier_status_df] DEFAULT 'true',
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [Supplier_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Transaction] (
    [id] INT NOT NULL IDENTITY(1,1),
    [date] DATETIME2 NOT NULL,
    [debitId] INT NOT NULL,
    [creditId] INT NOT NULL,
    [particulars] NVARCHAR(1000) NOT NULL,
    [amount] FLOAT(53) NOT NULL,
    [type] NVARCHAR(1000),
    [relatedId] INT,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Transaction_status_df] DEFAULT 'true',
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [Transaction_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [username] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [refreshToken] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [salary] INT,
    [idNo] NVARCHAR(1000) NOT NULL,
    [phone] NVARCHAR(1000),
    [address] NVARCHAR(1000),
    [bloodGroup] NVARCHAR(1000),
    [image] NVARCHAR(1000),
    [joinDate] DATETIME2,
    [leaveDate] DATETIME2,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [User_status_df] DEFAULT 'true',
    [roleId] INT NOT NULL,
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    [designationId] INT,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Slider] (
    [id] INT NOT NULL IDENTITY(1,1),
    [title] NVARCHAR(1000) NOT NULL,
    [text] NVARCHAR(1000) NOT NULL,
    [image] NVARCHAR(1000) NOT NULL,
    [text_position] NVARCHAR(1000) NOT NULL,
    [imgAltText] NVARCHAR(1000) NOT NULL CONSTRAINT [Slider_imgAltText_df] DEFAULT 'None',
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Slider_status_df] DEFAULT 'true',
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [Slider_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Menu] (
    [id] INT NOT NULL IDENTITY(1,1),
    [menuName] NVARCHAR(1000) NOT NULL,
    [slug] NVARCHAR(1000) NOT NULL,
    [heirarchy] INT NOT NULL,
    [parentId] INT NOT NULL,
    [activeStatus] NVARCHAR(1000) NOT NULL CONSTRAINT [Menu_activeStatus_df] DEFAULT 'true',
    CONSTRAINT [Menu_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[BusMast] (
    [id] INT NOT NULL IDENTITY(1,1),
    [busName] NVARCHAR(1000),
    [busType] NVARCHAR(1000),
    [busCategory] NVARCHAR(1000),
    [sittingCapacity] INT,
    [make] NVARCHAR(1000),
    [model] NVARCHAR(1000),
    [engineNo] NVARCHAR(1000),
    [chasisNo] NVARCHAR(1000),
    [companyId] INT,
    [branchId] INT,
    [userId] INT,
    [createdOn] DATETIME2 CONSTRAINT [BusMast_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [BusMast_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[DriverMast] (
    [id] INT NOT NULL IDENTITY(1,1),
    [driverName] NVARCHAR(1000),
    [driverAddr] NVARCHAR(1000),
    [cityID] BIGINT,
    [pincode] NVARCHAR(1000),
    [mobileNo] NVARCHAR(1000),
    [whatsAppNo] NVARCHAR(1000),
    [drvLicenseNo] NVARCHAR(1000),
    [drvLicenseExpDate] DATETIME2,
    [aadharCardNo] NVARCHAR(1000),
    [bankName] NVARCHAR(1000),
    [bankBranch] NVARCHAR(1000),
    [bankAcNo] NVARCHAR(1000),
    [bankAcType] NVARCHAR(1000),
    [bankIFSC] NVARCHAR(1000),
    [driverActive] NVARCHAR(1000),
    [referredBy] NVARCHAR(1000),
    [licensePath] NVARCHAR(1000),
    [adharPath] NVARCHAR(1000),
    [createdOn] DATETIME2 NOT NULL CONSTRAINT [DriverMast_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [userId] INT NOT NULL,
    [companyId] INT NOT NULL,
    [pfNo] NVARCHAR(1000),
    [esiNo] NVARCHAR(1000),
    CONSTRAINT [DriverMast_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[PartyMast] (
    [id] INT NOT NULL IDENTITY(1,1),
    [partyName] NVARCHAR(1000),
    [partyAddr] NVARCHAR(1000),
    [cityID] INT,
    [pincode] NVARCHAR(1000),
    [mobileNo] NVARCHAR(1000),
    [whatsAppNo] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [gstNo] NVARCHAR(1000),
    [panNo] NVARCHAR(1000),
    [referredBy] NVARCHAR(1000),
    [partyActive] NVARCHAR(1000),
    [crDays] INT,
    [crLimit] FLOAT(53),
    [createdOn] DATETIME2 NOT NULL CONSTRAINT [PartyMast_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [companyID] INT NOT NULL,
    [userID] INT NOT NULL,
    [cpName] NVARCHAR(1000),
    [cpNumber] NVARCHAR(1000)
    CONSTRAINT [PartyMast_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[PartySiteMast] (
    [id] INT NOT NULL IDENTITY(1,1),
    [siteName] NVARCHAR(1000),
    [siteShortName] NVARCHAR(1000),
    [siteActive] NVARCHAR(1000),
    [siteAddress] NVARCHAR(1000),
    [cityID] INT,
    [pinCode] NVARCHAR(1000),
    [partyID] BIGINT,
    CONSTRAINT [PartySiteMast_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[VendorMast] (
    [id] INT NOT NULL IDENTITY(1,1),
    [vendorType] NVARCHAR(1000),
    [vendorName] NVARCHAR(1000),
    [vendAddr] NVARCHAR(1000),
    [cityID] INT,
    [pinCode] NVARCHAR(1000),
    [mobileNo] NVARCHAR(1000),
    [whatsAppNo] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [gstNo] NVARCHAR(1000),
    [panNo] NVARCHAR(1000),
    [bankName] NVARCHAR(1000),
    [bankBranch] NVARCHAR(1000),
    [bankAcNo] NVARCHAR(1000),
    [bankAcType] NVARCHAR(1000),
    [bankIFSC] NVARCHAR(1000),
    [vendorActive] NVARCHAR(1000),
    [referredBy] NVARCHAR(1000),
    [createdOn] DATETIME2 NOT NULL CONSTRAINT [VendorMast_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [userID] INT NOT NULL,
    [companyID] INT NOT NULL,
    [username] NVARCHAR(1000),
    [password] NVARCHAR(1000),
    [token] NVARCHAR(1000),
    [wallet] INT,
    CONSTRAINT [VendorMast_pkey] PRIMARY KEY CLUSTERED ([id])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
