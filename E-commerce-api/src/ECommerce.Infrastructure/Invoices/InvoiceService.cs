using ECommerce.Application.Common.Exceptions;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.Orders;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace ECommerce.Infrastructure.Invoices;

public class InvoiceService : IInvoiceService
{
    private const string Brand = "#2a9d8f";
    private const string Ink = "#264653";

    static InvoiceService()
    {
        QuestPDF.Settings.License = LicenseType.Community;
    }

    private readonly IAppDbContext _context;

    public InvoiceService(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<byte[]> GenerateAsync(int orderId, int userId, bool isAdmin, CancellationToken cancellationToken = default)
    {
        var order = await _context.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == orderId, cancellationToken)
            ?? throw new NotFoundException("Order", orderId);

        if (!isAdmin && order.UserId != userId)
        {
            throw new ForbiddenException("You can only download your own invoices.");
        }

        var buyer = await _context.Users
            .Where(u => u.Id == order.UserId)
            .Select(u => new { u.Name, u.Email })
            .FirstOrDefaultAsync(cancellationToken);

        var buyerName = buyer?.Name ?? "Cliente";
        var buyerEmail = buyer?.Email ?? string.Empty;

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(40);
                page.DefaultTextStyle(x => x.FontSize(10).FontColor(Ink));

                page.Header().Row(row =>
                {
                    row.RelativeItem().Column(col =>
                    {
                        col.Item().Text("● E-commerce").FontSize(20).Bold().FontColor(Brand);
                        col.Item().Text("Factura de compra").FontSize(11).FontColor(Colors.Grey.Darken1);
                    });
                    row.ConstantItem(180).Column(col =>
                    {
                        col.Item().AlignRight().Text($"Factura #{order.Id:D6}").Bold();
                        col.Item().AlignRight().Text(order.CreatedAt.ToString("dd MMM yyyy")).FontColor(Colors.Grey.Darken1);
                        col.Item().AlignRight().Text($"Estado: {order.Status}").FontColor(Colors.Grey.Darken1);
                    });
                });

                page.Content().PaddingVertical(20).Column(col =>
                {
                    col.Spacing(18);

                    col.Item().Column(bill =>
                    {
                        bill.Item().Text("Facturar a").FontSize(9).Bold().FontColor(Colors.Grey.Medium);
                        bill.Item().Text(buyerName).Bold();
                        if (!string.IsNullOrWhiteSpace(buyerEmail))
                        {
                            bill.Item().Text(buyerEmail).FontColor(Colors.Grey.Darken1);
                        }
                    });

                    col.Item().Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn(5);
                            columns.RelativeColumn(1);
                            columns.RelativeColumn(2);
                            columns.RelativeColumn(2);
                        });

                        table.Header(header =>
                        {
                            header.Cell().Background(Brand).Padding(6).Text("Producto").FontColor(Colors.White).Bold();
                            header.Cell().Background(Brand).Padding(6).AlignRight().Text("Cant.").FontColor(Colors.White).Bold();
                            header.Cell().Background(Brand).Padding(6).AlignRight().Text("Precio").FontColor(Colors.White).Bold();
                            header.Cell().Background(Brand).Padding(6).AlignRight().Text("Total").FontColor(Colors.White).Bold();
                        });

                        foreach (var item in order.Items)
                        {
                            var name = string.IsNullOrWhiteSpace(item.VariantLabel)
                                ? item.ProductName
                                : $"{item.ProductName} ({item.VariantLabel})";

                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(6).Text(name);
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(6).AlignRight().Text(item.Quantity.ToString());
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(6).AlignRight().Text($"${item.UnitPrice:0.00}");
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(6).AlignRight().Text($"${item.UnitPrice * item.Quantity:0.00}");
                        }
                    });

                    col.Item().AlignRight().Row(row =>
                    {
                        row.ConstantItem(120).Text("Total").Bold().FontSize(13);
                        row.ConstantItem(100).AlignRight().Text($"${order.Total:0.00}").Bold().FontSize(13).FontColor(Brand);
                    });
                });

                page.Footer().AlignCenter().Text("Gracias por tu compra en E-commerce").FontColor(Colors.Grey.Medium).FontSize(9);
            });
        });

        return document.GeneratePdf();
    }
}
