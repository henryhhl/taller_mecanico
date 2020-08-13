



create view V_AdmisionDeuda
	as

select p.idPago, a.idpaciente, pa.idAseguradora, s.idhospital, 
	DATENAME(mm, p.fecha) as name_mes, DATENAME(year, p.fecha) as years,
	(select isnull(SUM(de.monto), 0) from detalle_pago de where de.idPago = p.idPago) monto_adeudado
	--, sum(p.monto_cancelado), p.montoTotal
	, case 
		when ((select isnull(SUM(de.monto), 0) from detalle_pago de where de.idPago = p.idPago) = 0) then 'Parcial'
		else 'Impaga'
	end as tipo_pago

from admision a, pago p, paciente pa, sala s
where a.idadmision = p.idAdmision and pa.idpaciente = a.idpaciente and  a.idsala = s.idsala
group by p.idPago, a.idpaciente, pa.idAseguradora, s.idhospital, DATENAME(mm, p.fecha), DATENAME(year, p.fecha), p.idPago, p.montoTotal




select a.idsala, s.idsala, a.idpaciente, DATENAME(mm, f.fecha) as name_mes, DATENAME(year, f.fecha) as years,
    DATENAME(dw, f.fecha) as dia, 
from admision a, sala s, ficha f
where a.idsala = s.idsala and a.idadmision = f.idadmision