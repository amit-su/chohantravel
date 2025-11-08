BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[StateMast] (
    [id] INT NOT NULL IDENTITY(1,1),
    [state] NVARCHAR(1000),
    [userid] INT,
    [compname] NVARCHAR(1000),
    [statename] NVARCHAR(1000),
    [CreatedOn] DATETIME2 NOT NULL CONSTRAINT [StateMast_CreatedOn_df] DEFAULT CURRENT_TIMESTAMP,
    [user_id] INT NOT NULL CONSTRAINT [StateMast_user_id_df] DEFAULT 0,
    [company_id] INT NOT NULL CONSTRAINT [StateMast_company_id_df] DEFAULT 0,
    CONSTRAINT [StateMast_pkey] PRIMARY KEY CLUSTERED ([id])
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
