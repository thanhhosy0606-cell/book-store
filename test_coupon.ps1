$headers = @{ "Content-Type" = "application/json" }
$body = '{"code":"SALE25", "title":"Dai Tiec Mua He 25%", "discountType":"PERCENT", "discountValue":25, "minOrderAmount":150000, "maxDiscountAmount":100000, "badgeText":"SUMMER ☀️", "badgeColor":"danger", "description":"Uu dai giam 25% toi da 100k cho don tu 150k"}'
$res = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/coupons" -Method Post -Headers $headers -Body $body
Write-Output "--- Create Coupon Response ---"
Write-Output ($res | ConvertTo-Json -Depth 4)

$batchBody = '{"categoryId": null, "discountPercent": 15}'
$batchRes = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/coupons/batch-discount" -Method Post -Headers $headers -Body $batchBody
Write-Output "--- Batch Discount Response ---"
Write-Output ($batchRes | ConvertTo-Json -Depth 4)
