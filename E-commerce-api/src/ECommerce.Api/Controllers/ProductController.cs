using ECommerce.Application.Products;
using ECommerce.Application.Products.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductController(IProductService productService)
    {
        _productService = productService;
    }

    // GET: api/product
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts(CancellationToken cancellationToken)
    {
        var products = await _productService.GetAllAsync(cancellationToken);
        return Ok(products);
    }

    // GET: api/product/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductDto>> GetProduct(int id, CancellationToken cancellationToken)
    {
        var product = await _productService.GetByIdAsync(id, cancellationToken);
        return product is null ? NotFound() : Ok(product);
    }

    // POST: api/product
    [HttpPost]
    public async Task<ActionResult<ProductDto>> CreateProduct(CreateProductDto dto, CancellationToken cancellationToken)
    {
        var created = await _productService.CreateAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(GetProduct), new { id = created.Id }, created);
    }

    // PUT: api/product/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateProduct(int id, UpdateProductDto dto, CancellationToken cancellationToken)
    {
        var updated = await _productService.UpdateAsync(id, dto, cancellationToken);
        return updated ? NoContent() : NotFound();
    }

    // DELETE: api/product/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteProduct(int id, CancellationToken cancellationToken)
    {
        var deleted = await _productService.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
