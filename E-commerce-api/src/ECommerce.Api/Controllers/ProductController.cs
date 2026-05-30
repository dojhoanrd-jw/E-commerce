using ECommerce.Application.Products;
using ECommerce.Application.Products.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController : ApiControllerBase
{
    private const string Managers = "Seller,Admin";

    private readonly IProductService _productService;

    public ProductController(IProductService productService)
    {
        _productService = productService;
    }

    // GET: api/product  (public)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts(CancellationToken cancellationToken)
    {
        var products = await _productService.GetAllAsync(cancellationToken);
        return Ok(products);
    }

    // GET: api/product/mine  (Seller or Admin) — the caller's own products
    [Authorize(Roles = Managers)]
    [HttpGet("mine")]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetMyProducts(CancellationToken cancellationToken)
    {
        var products = await _productService.GetBySellerAsync(CurrentUserId, cancellationToken);
        return Ok(products);
    }

    // GET: api/product/5  (public)
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductDto>> GetProduct(int id, CancellationToken cancellationToken)
    {
        var product = await _productService.GetByIdAsync(id, cancellationToken);
        return Ok(product);
    }

    // POST: api/product  (Seller or Admin)
    [Authorize(Roles = Managers)]
    [HttpPost]
    public async Task<ActionResult<ProductDto>> CreateProduct(CreateProductDto dto, CancellationToken cancellationToken)
    {
        var created = await _productService.CreateAsync(dto, CurrentUserId, cancellationToken);
        return CreatedAtAction(nameof(GetProduct), new { id = created.Id }, created);
    }

    // PUT: api/product/5  (owner Seller or Admin)
    [Authorize(Roles = Managers)]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateProduct(int id, UpdateProductDto dto, CancellationToken cancellationToken)
    {
        await _productService.UpdateAsync(id, dto, CurrentUserId, IsAdmin, cancellationToken);
        return NoContent();
    }

    // DELETE: api/product/5  (owner Seller or Admin)
    [Authorize(Roles = Managers)]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteProduct(int id, CancellationToken cancellationToken)
    {
        await _productService.DeleteAsync(id, CurrentUserId, IsAdmin, cancellationToken);
        return NoContent();
    }
}
