/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AdjustInvoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AdjustInvoiceProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AppSetting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Color` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Coupon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomerPermissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Designation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Email` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmailConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Menu` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Migration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PageSize` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PersonalAccessToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductBrand` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductSubCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductTax` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductVariant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductVariantImageOrVideo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PurchaseInvoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PurchaseInvoiceProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PurchaseReorderInvoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Quote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuoteProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReturnPurchaseInvoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReturnPurchaseInvoiceProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReturnSaleInvoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReturnSaleInvoiceProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReviewRating` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SaleInvoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SaleInvoiceProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SaleInvoiceVat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Shift` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Size` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Slider` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubAccount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Supplier` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropTable
DROP TABLE [dbo].[Account];

-- DropTable
DROP TABLE [dbo].[AdjustInvoice];

-- DropTable
DROP TABLE [dbo].[AdjustInvoiceProduct];

-- DropTable
DROP TABLE [dbo].[AppSetting];

-- DropTable
DROP TABLE [dbo].[Color];

-- DropTable
DROP TABLE [dbo].[Coupon];

-- DropTable
DROP TABLE [dbo].[Customer];

-- DropTable
DROP TABLE [dbo].[CustomerPermissions];

-- DropTable
DROP TABLE [dbo].[Designation];

-- DropTable
DROP TABLE [dbo].[Email];

-- DropTable
DROP TABLE [dbo].[EmailConfig];

-- DropTable
DROP TABLE [dbo].[Menu];

-- DropTable
DROP TABLE [dbo].[Migration];

-- DropTable
DROP TABLE [dbo].[PageSize];

-- DropTable
DROP TABLE [dbo].[PersonalAccessToken];

-- DropTable
DROP TABLE [dbo].[Product];

-- DropTable
DROP TABLE [dbo].[ProductBrand];

-- DropTable
DROP TABLE [dbo].[ProductCategory];

-- DropTable
DROP TABLE [dbo].[ProductSubCategory];

-- DropTable
DROP TABLE [dbo].[ProductTax];

-- DropTable
DROP TABLE [dbo].[ProductVariant];

-- DropTable
DROP TABLE [dbo].[ProductVariantImageOrVideo];

-- DropTable
DROP TABLE [dbo].[PurchaseInvoice];

-- DropTable
DROP TABLE [dbo].[PurchaseInvoiceProduct];

-- DropTable
DROP TABLE [dbo].[PurchaseReorderInvoice];

-- DropTable
DROP TABLE [dbo].[Quote];

-- DropTable
DROP TABLE [dbo].[QuoteProduct];

-- DropTable
DROP TABLE [dbo].[ReturnPurchaseInvoice];

-- DropTable
DROP TABLE [dbo].[ReturnPurchaseInvoiceProduct];

-- DropTable
DROP TABLE [dbo].[ReturnSaleInvoice];

-- DropTable
DROP TABLE [dbo].[ReturnSaleInvoiceProduct];

-- DropTable
DROP TABLE [dbo].[ReviewRating];

-- DropTable
DROP TABLE [dbo].[SaleInvoice];

-- DropTable
DROP TABLE [dbo].[SaleInvoiceProduct];

-- DropTable
DROP TABLE [dbo].[SaleInvoiceVat];

-- DropTable
DROP TABLE [dbo].[Shift];

-- DropTable
DROP TABLE [dbo].[Size];

-- DropTable
DROP TABLE [dbo].[Slider];

-- DropTable
DROP TABLE [dbo].[SubAccount];

-- DropTable
DROP TABLE [dbo].[Supplier];

-- DropTable
DROP TABLE [dbo].[Transaction];

-- CreateTable
CREATE TABLE [dbo].[CityMast] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [created_at] DATETIME2,
    [updated_at] DATETIME2,
    CONSTRAINT [CityMast_pkey] PRIMARY KEY CLUSTERED ([id])
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
