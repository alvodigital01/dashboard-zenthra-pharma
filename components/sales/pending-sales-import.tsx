"use client";

import { CheckCircle2, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { formatCurrencyBRL } from "@/lib/utils";
import type { SaleInsert } from "@/types/sales";

type ImportSale = {
  customerName: string;
  unitPrice: number;
  saleDate: string;
  productName?: string;
  productCategory?: string;
  paymentMethod?: "pix" | "debit_card" | "credit_card";
  installments?: number | null;
  details?: string;
};

type ImportBatch = {
  title: string;
  prefix: string;
  description: string;
  notes: string;
  sales: readonly ImportSale[];
};

const november26SalesBatch: ImportBatch = {
  title: "24 vendas de 23 a 26/11/2026",
  prefix: "LOTE-VENDAS-2026-11-23-26",
  description: "Dados da planilha; categoria Espumas, quantidade 1 e pagamento Pix por padrão. A venda de R$ 469 foi informada como cartão, sem modalidade; confira e ajuste o pagamento após importar.",
  notes: "Importação da planilha de 23 a 26/11/2026.",
  sales: [
    { customerName: "JC Estofados", unitPrice: 450, saleDate: "2026-11-23" },
    { customerName: "Beto", unitPrice: 170, saleDate: "2026-11-23" },
    { customerName: "Não informado", unitPrice: 469, saleDate: "2026-11-23", details: "Venda no cartão; modalidade não informada na planilha." },
    { customerName: "Zani", unitPrice: 636, saleDate: "2026-11-23" },
    { customerName: "AWR", unitPrice: 480, saleDate: "2026-11-24" },
    { customerName: "Sem nome", unitPrice: 300, saleDate: "2026-11-24" },
    { customerName: "Novo Ambiente", unitPrice: 300, saleDate: "2026-11-24" },
    { customerName: "Lindolfo", unitPrice: 636, saleDate: "2026-11-24" },
    { customerName: "Édson Lopes", unitPrice: 731, saleDate: "2026-11-24" },
    { customerName: "Júnior", unitPrice: 180, saleDate: "2026-11-24" },
    { customerName: "Arnaldo", unitPrice: 218, saleDate: "2026-11-24" },
    { customerName: "Tapeçaria sob medida (Alessandra)", unitPrice: 500, saleDate: "2026-11-24" },
    { customerName: "Paulo Serafim", unitPrice: 700, saleDate: "2026-11-24" },
    { customerName: "Elshaday", unitPrice: 150, saleDate: "2026-11-24" },
    { customerName: "Andréia", unitPrice: 420.12, saleDate: "2026-11-25" },
    { customerName: "Cadeira (Marciano)", unitPrice: 125, saleDate: "2026-11-25" },
    { customerName: "Max Estofados", unitPrice: 800, saleDate: "2026-11-25" },
    { customerName: "Lourenço", unitPrice: 180, saleDate: "2026-11-25" },
    { customerName: "Enio", unitPrice: 400, saleDate: "2026-11-25" },
    { customerName: "Brito", unitPrice: 100, saleDate: "2026-11-26" },
    { customerName: "Filadélfia (Rogério)", unitPrice: 428.6, saleDate: "2026-11-26" },
    { customerName: "Ronaldo", unitPrice: 325, saleDate: "2026-11-26" },
    { customerName: "Hudson", unitPrice: 300, saleDate: "2026-11-26" },
    { customerName: "Júnior", unitPrice: 2000, saleDate: "2026-11-26" }
  ]
};

const informedSalesBatch: ImportBatch = {
  title: "16 vendas de 13/10/2026",
  prefix: "LOTE-2026-10-13",
  description:
    "Categoria Espumas, status Pago, quantidade 1 e pagamento via Pix. As saídas e a venda sem valor não fazem parte deste lote.",
  notes: "Importação em lote das vendas informadas em 13/10/2026.",
  sales: [
    { customerName: "Beto Tapeçaria", unitPrice: 450, saleDate: "2026-10-13" },
    { customerName: "Marcos Tapeceiro", unitPrice: 160, saleDate: "2026-10-13" },
    { customerName: "Tapeçaria em Frente ao Campo", unitPrice: 100, saleDate: "2026-10-13" },
    { customerName: "DWR Tapeçaria", unitPrice: 350, saleDate: "2026-10-13" },
    { customerName: "Tapeçaria Iguaçu", unitPrice: 540, saleDate: "2026-10-13" },
    { customerName: "Tapeçaria Elshaday", unitPrice: 306, saleDate: "2026-10-13" },
    { customerName: "Tapeçaria 2 Irmãos", unitPrice: 80, saleDate: "2026-10-13" },
    { customerName: "Art Gold", unitPrice: 899, saleDate: "2026-10-13" },
    { customerName: "Vanderlei", unitPrice: 330, saleDate: "2026-10-13" },
    { customerName: "Leo Estofados", unitPrice: 750, saleDate: "2026-10-13" },
    { customerName: "Beto Tapeçaria", unitPrice: 198, saleDate: "2026-10-13" },
    { customerName: "Arnaldo", unitPrice: 68, saleDate: "2026-10-13" },
    { customerName: "Junior Soufa", unitPrice: 1350, saleDate: "2026-10-13" },
    { customerName: "Graciosa", unitPrice: 188, saleDate: "2026-10-13" },
    { customerName: "Art Gold", unitPrice: 1600, saleDate: "2026-10-13" },
    { customerName: "Prado", unitPrice: 720, saleDate: "2026-10-13" }
  ]
};

const receiptSalesBatch: ImportBatch = {
  title: "8 vendas dos comprovantes de outubro",
  prefix: "COMPROVANTES-OUT-2026",
  description:
    "Datas conforme os comprovantes, categoria Espumas, status Pago, quantidade 1 e pagamento via Pix.",
  notes: "Importação em lote a partir dos comprovantes de Pix de outubro de 2026.",
  sales: [
    { customerName: "Andreia Roque dos Santos", unitPrice: 320, saleDate: "2026-10-09" },
    { customerName: "Tapeçaria Rodricar Ltda", unitPrice: 238, saleDate: "2026-10-02" },
    {
      customerName: "Alessandra A. da Silva - Móveis e Decorações Ltda",
      unitPrice: 880,
      saleDate: "2026-10-08"
    },
    { customerName: "Ismael Ruiz", unitPrice: 96, saleDate: "2026-10-06" },
    { customerName: "José Junior Teixeira", unitPrice: 2000, saleDate: "2026-10-06" },
    { customerName: "Enio Rocha Viana", unitPrice: 100, saleDate: "2026-10-09" },
    { customerName: "C.L. Faria Estofados Ltda", unitPrice: 160, saleDate: "2026-10-03" },
    { customerName: "Agilenildo da Silva Brito", unitPrice: 350, saleDate: "2026-10-09" }
  ]
};

const whatsappSalesBatch: ImportBatch = {
  title: "12 vendas de 14 e 15/10/2026",
  prefix: "LOTE-WHATSAPP-2026-10-14-15",
  description:
    "Sete vendas de 14/10 e cinco vendas de 15/10, categoria Espumas, status Pago, quantidade 1 e pagamento via Pix.",
  notes: "Importação em lote das vendas recebidas pelo WhatsApp em 14 e 15/10/2026.",
  sales: [
    { customerName: "DWR Tapeçaria", unitPrice: 1500, saleDate: "2026-10-14" },
    { customerName: "Leandro", unitPrice: 340, saleDate: "2026-10-14" },
    { customerName: "Beto Tapeçaria", unitPrice: 288, saleDate: "2026-10-14" },
    { customerName: "Arnaldo", unitPrice: 145, saleDate: "2026-10-14" },
    { customerName: "Magal", unitPrice: 280, saleDate: "2026-10-14" },
    { customerName: "Tapeçaria 2 Irmãos", unitPrice: 60, saleDate: "2026-10-14" },
    { customerName: "Tapeçaria Londrina", unitPrice: 1100, saleDate: "2026-10-14" },
    { customerName: "Soufã Estofados", unitPrice: 1000, saleDate: "2026-10-15" },
    { customerName: "Tapeçaria de Cadeira", unitPrice: 450, saleDate: "2026-10-15" },
    { customerName: "Stilus", unitPrice: 335, saleDate: "2026-10-15" },
    { customerName: "Arnaldo", unitPrice: 200, saleDate: "2026-10-15" },
    { customerName: "Andreia", unitPrice: 638, saleDate: "2026-10-15" }
  ]
};

const additionalSalesBatch: ImportBatch = {
  title: "5 vendas adicionais de 13/10/2026",
  prefix: "LOTE-ADICIONAL-2026-10-13",
  description: "Categoria Espumas, status Pago, quantidade 1 e pagamento via Pix.",
  notes: "Importação em lote das vendas adicionais informadas em 13/10/2026.",
  sales: [
    { customerName: "Tapeçaria Arthur Tomas", unitPrice: 65, saleDate: "2026-10-13" },
    { customerName: "Vanderlei", unitPrice: 218, saleDate: "2026-10-13" },
    { customerName: "Tapeceiro Cambé", unitPrice: 250, saleDate: "2026-10-13" },
    { customerName: "Art Manhã Estofados", unitPrice: 140, saleDate: "2026-10-13" },
    { customerName: "Roberto Tapeçaria", unitPrice: 400, saleDate: "2026-10-13" }
  ]
};

const whatsappOctober23SalesBatch: ImportBatch = {
  title: "18 vendas de 23/10/2026",
  prefix: "LOTE-WHATSAPP-2026-10-23",
  description: "Categoria Espumas, status Pago, quantidade 1 e pagamento via Pix.",
  notes: "Importação em lote das vendas recebidas pelo WhatsApp em 23/10/2026.",
  sales: [
    { customerName: "JC Estofados", unitPrice: 400, saleDate: "2026-10-23" },
    { customerName: "Tapeçaria", unitPrice: 115, saleDate: "2026-10-23" },
    { customerName: "Tapeçaria Londrina", unitPrice: 870, saleDate: "2026-10-23" },
    { customerName: "Fábrica de Capa Instrumento", unitPrice: 1150, saleDate: "2026-10-23" },
    { customerName: "Tapeçaria Iguaçu", unitPrice: 120, saleDate: "2026-10-23" },
    { customerName: "Arena Estofados", unitPrice: 1400, saleDate: "2026-10-23" },
    { customerName: "Tapeçaria Avenida", unitPrice: 434, saleDate: "2026-10-23" },
    { customerName: "Tapeçaria Avenida", unitPrice: 200, saleDate: "2026-10-23" },
    { customerName: "Graciosa", unitPrice: 220, saleDate: "2026-10-23" },
    { customerName: "Geraldo", unitPrice: 300, saleDate: "2026-10-23" },
    { customerName: "Administrador Grupo", unitPrice: 160, saleDate: "2026-10-23" },
    { customerName: "Hadriani", unitPrice: 700, saleDate: "2026-10-23" },
    { customerName: "Rosely", unitPrice: 80, saleDate: "2026-10-23" },
    { customerName: "Tapeçaria Iguaçu", unitPrice: 200, saleDate: "2026-10-23" },
    { customerName: "Atilus Estofado", unitPrice: 100, saleDate: "2026-10-23" },
    { customerName: "JC Estofados", unitPrice: 280, saleDate: "2026-10-23" },
    { customerName: "Júnior", unitPrice: 1000, saleDate: "2026-10-23" },
    { customerName: "Prado Tapeçaria", unitPrice: 720, saleDate: "2026-10-23" }
  ]
};

const whatsappOctober31SalesBatch: ImportBatch = {
  title: "24 vendas de 31/10/2026",
  prefix: "LOTE-WHATSAPP-2026-10-31",
  description:
    "Todas com status Pago, inclusive as quatro originalmente a receber. Quantidade 1 e pagamento via Pix, conforme o padrão do importador.",
  notes:
    "Vendas informadas por Nicolas pelo WhatsApp em 31/10/2026. Todas marcadas como pagas por solicitação do usuário. Quantidade, produto e pagamento seguem o padrão do importador quando não informados.",
  sales: [
    { customerName: "Não informado", unitPrice: 700, saleDate: "2026-10-31" },
    { customerName: "Tio Ênio", unitPrice: 69.9, saleDate: "2026-10-31", productName: "Grampo", productCategory: "Grampos" },
    { customerName: "João", unitPrice: 198, saleDate: "2026-10-31" },
    { customerName: "Elshaday", unitPrice: 150, saleDate: "2026-10-31" },
    { customerName: "Tapeçaria Cadeira", unitPrice: 600, saleDate: "2026-10-31" },
    { customerName: "Arnaldo", unitPrice: 260, saleDate: "2026-10-31" },
    { customerName: "Santos Estofados", unitPrice: 219, saleDate: "2026-10-31" },
    { customerName: "Júnior Soufã", unitPrice: 300, saleDate: "2026-10-31" },
    { customerName: "Lucas Inovax", unitPrice: 200, saleDate: "2026-10-31" },
    { customerName: "Léo", unitPrice: 760, saleDate: "2026-10-31" },
    { customerName: "Zani", unitPrice: 450, saleDate: "2026-10-31" },
    { customerName: "Stilus", unitPrice: 270, saleDate: "2026-10-31" },
    { customerName: "Lucas", unitPrice: 69, saleDate: "2026-10-31" },
    { customerName: "Júnior", unitPrice: 2000, saleDate: "2026-10-31" },
    { customerName: "Tapeçaria Londrina", unitPrice: 890, saleDate: "2026-10-31" },
    { customerName: "Fábrica de capas de instrumentos", unitPrice: 1500, saleDate: "2026-10-31" },
    { customerName: "Júnior", unitPrice: 380, saleDate: "2026-10-31" },
    { customerName: "Ativa Estofados", unitPrice: 400, saleDate: "2026-10-31" },
    { customerName: "DWR", unitPrice: 520, saleDate: "2026-10-31" },
    { customerName: "Aleatório", unitPrice: 37, saleDate: "2026-10-31" },
    { customerName: "Léo Estofados", unitPrice: 740, saleDate: "2026-10-31" },
    { customerName: "Edson Lopes", unitPrice: 1056, saleDate: "2026-10-31" },
    { customerName: "JC Estofados", unitPrice: 150, saleDate: "2026-10-31" },
    { customerName: "Andréia", unitPrice: 539, saleDate: "2026-10-31" }
  ]
};

const novemberSalesBatch: ImportBatch = {
 title: "80 vendas de novembro de 2026", prefix: "LOTE-CSV-VENDAS-NOV-2026",
 description: "Datas e detalhes do CSV. Categoria Espumas, quantidade 1 e status Pago; Pix quando o pagamento não foi informado. Cartão sem tipo ou parcelas foi registrado como crédito em 1 parcela.",
 notes: "Importação do CSV de novembro de 2026.", sales: [
  {
    "customerName": "Tapeçaria Iguaçu",
    "unitPrice": 500,
    "saleDate": "2026-11-03",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda tapeçaria Iguaçu. Origem: mensagem."
  },
  {
    "customerName": "Magal",
    "unitPrice": 700,
    "saleDate": "2026-11-03",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Tapeceiro",
    "unitPrice": 84,
    "saleDate": "2026-11-03",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "C.L Faria Estofados (JC)",
    "unitPrice": 419,
    "saleDate": "2026-11-03",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda JC Estofados (Pix recebido). Origem: comprovante Pix."
  },
  {
    "customerName": "Art Manhã",
    "unitPrice": 207,
    "saleDate": "2026-11-03",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Zani",
    "unitPrice": 500,
    "saleDate": "2026-11-04",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Graciosa",
    "unitPrice": 525,
    "saleDate": "2026-11-04",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Rosely",
    "unitPrice": 50,
    "saleDate": "2026-11-04",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Ativa Estofados",
    "unitPrice": 120,
    "saleDate": "2026-11-04",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Max Estofados",
    "unitPrice": 110,
    "saleDate": "2026-11-04",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Fernando",
    "unitPrice": 50,
    "saleDate": "2026-11-04",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Ronaldo",
    "unitPrice": 242,
    "saleDate": "2026-11-04",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Stilus",
    "unitPrice": 150,
    "saleDate": "2026-11-04",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Crislane Aline Teste da Silva",
    "unitPrice": 122,
    "saleDate": "2026-11-05",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda João (Pix recebido). Origem: comprovante Pix."
  },
  {
    "customerName": "Arnaldo",
    "unitPrice": 100,
    "saleDate": "2026-11-05",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "El Shaday",
    "unitPrice": 580,
    "saleDate": "2026-11-05",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Arena",
    "unitPrice": 400,
    "saleDate": "2026-11-05",
    "paymentMethod": "credit_card",
    "installments": 1,
    "details": "Venda no cartão. Origem: mensagem."
  },
  {
    "customerName": "Ismael Ruiz",
    "unitPrice": 84,
    "saleDate": "2026-11-05",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda DWR (Pix recebido). Origem: comprovante Pix."
  },
  {
    "customerName": "Bianca da Silva Damasceno",
    "unitPrice": 89,
    "saleDate": "2026-11-06",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda Geraldo (Pix recebido). Origem: comprovante Pix."
  },
  {
    "customerName": "Fernando",
    "unitPrice": 30,
    "saleDate": "2026-11-06",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Geraldo",
    "unitPrice": 43,
    "saleDate": "2026-11-06",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Alécio",
    "unitPrice": 264,
    "saleDate": "2026-11-06",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Zani",
    "unitPrice": 477,
    "saleDate": "2026-11-06",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Max Estofados",
    "unitPrice": 350,
    "saleDate": "2026-11-06",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Novo Ambiente",
    "unitPrice": 300,
    "saleDate": "2026-11-06",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Édson Lopes",
    "unitPrice": 900,
    "saleDate": "2026-11-06",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Rosely",
    "unitPrice": 400,
    "saleDate": "2026-11-07",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Novo Ambiente",
    "unitPrice": 300,
    "saleDate": "2026-11-09",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Stilus",
    "unitPrice": 300,
    "saleDate": "2026-11-09",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Ismael Ruiz",
    "unitPrice": 520,
    "saleDate": "2026-11-09",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda (Pix recebido). Origem: comprovante Pix."
  },
  {
    "customerName": "Geraldo",
    "unitPrice": 874,
    "saleDate": "2026-11-09",
    "paymentMethod": "debit_card",
    "installments": null,
    "details": "Venda no cartão de débito. Origem: mensagem."
  },
  {
    "customerName": "Não informado",
    "unitPrice": 231.9,
    "saleDate": "2026-11-09",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda — anotada como \"perto do Marista\". Origem: mensagem."
  },
  {
    "customerName": "Rafael Luiz Malvezi",
    "unitPrice": 580,
    "saleDate": "2026-11-10",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda El Shaday (Pix recebido). Origem: comprovante Pix."
  },
  {
    "customerName": "Geraldo",
    "unitPrice": 540,
    "saleDate": "2026-11-10",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Júnior",
    "unitPrice": 550,
    "saleDate": "2026-11-12",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Zani",
    "unitPrice": 638,
    "saleDate": "2026-11-12",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Andréia",
    "unitPrice": 270,
    "saleDate": "2026-11-12",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Arthur Tomás",
    "unitPrice": 300,
    "saleDate": "2026-11-12",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Estofados Santos",
    "unitPrice": 300,
    "saleDate": "2026-11-12",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "JC Estofados",
    "unitPrice": 450,
    "saleDate": "2026-11-12",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Édson Lopes",
    "unitPrice": 180,
    "saleDate": "2026-11-12",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Andréia",
    "unitPrice": 175,
    "saleDate": "2026-11-12",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Tapeçaria Rolândia",
    "unitPrice": 270,
    "saleDate": "2026-11-12",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Tapeçaria Avenida",
    "unitPrice": 150,
    "saleDate": "2026-11-12",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Não informado",
    "unitPrice": 1000,
    "saleDate": "2026-11-12",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda da sobra das espumas de Mandaguari. Origem: mensagem."
  },
  {
    "customerName": "Novo Ambiente",
    "unitPrice": 170,
    "saleDate": "2026-11-12",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Enio",
    "unitPrice": 1100,
    "saleDate": "2026-11-12",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Zani",
    "unitPrice": 776,
    "saleDate": "2026-11-12",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Alexandro",
    "unitPrice": 158,
    "saleDate": "2026-11-12",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Arnaldo",
    "unitPrice": 350,
    "saleDate": "2026-11-13",
    "paymentMethod": "credit_card",
    "installments": 1,
    "details": "Venda no cartão. Origem: mensagem."
  },
  {
    "customerName": "Não informado",
    "unitPrice": 344,
    "saleDate": "2026-11-13",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda — anotada só como \"344\". Origem: mensagem."
  },
  {
    "customerName": "Brito",
    "unitPrice": 340,
    "saleDate": "2026-11-14",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Marcos",
    "unitPrice": 100,
    "saleDate": "2026-11-14",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Não informado",
    "unitPrice": 50,
    "saleDate": "2026-11-14",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Magal",
    "unitPrice": 270,
    "saleDate": "2026-11-14",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Não informado",
    "unitPrice": 170,
    "saleDate": "2026-11-14",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Andréia",
    "unitPrice": 70,
    "saleDate": "2026-11-16",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Fernando Alex Pereira Garcia",
    "unitPrice": 130,
    "saleDate": "2026-11-16",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda (Pix recebido). Origem: comprovante Pix."
  },
  {
    "customerName": "C.L Faria Estofados (JC)",
    "unitPrice": 258,
    "saleDate": "2026-11-16",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda (Pix recebido). Origem: comprovante Pix."
  },
  {
    "customerName": "Prado",
    "unitPrice": 720,
    "saleDate": "2026-11-16",
    "paymentMethod": "credit_card",
    "installments": 4,
    "details": "Venda no cartão 4x. Origem: mensagem."
  },
  {
    "customerName": "Lima",
    "unitPrice": 300,
    "saleDate": "2026-11-16",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Não informado",
    "unitPrice": 570,
    "saleDate": "2026-11-17",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda — anotada como \"atrás Marista\". Origem: mensagem."
  },
  {
    "customerName": "AWR",
    "unitPrice": 800,
    "saleDate": "2026-11-17",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Stilus",
    "unitPrice": 350,
    "saleDate": "2026-11-17",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Baiano",
    "unitPrice": 150,
    "saleDate": "2026-11-17",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Marciano Lima Correia",
    "unitPrice": 325,
    "saleDate": "2026-11-18",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda (Pix recebido). Origem: comprovante Pix."
  },
  {
    "customerName": "Arthur Tomás",
    "unitPrice": 175,
    "saleDate": "2026-11-18",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Art Gold",
    "unitPrice": 750,
    "saleDate": "2026-11-18",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Brito",
    "unitPrice": 358,
    "saleDate": "2026-11-18",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Vizinho",
    "unitPrice": 250,
    "saleDate": "2026-11-18",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Não informado",
    "unitPrice": 180,
    "saleDate": "2026-11-18",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Tapeceiro",
    "unitPrice": 210,
    "saleDate": "2026-11-18",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Léo",
    "unitPrice": 1000,
    "saleDate": "2026-11-18",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Não informado",
    "unitPrice": 350,
    "saleDate": "2026-11-19",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda — anotada só como \"350\". Origem: mensagem."
  },
  {
    "customerName": "Vanderlei (Rolândia)",
    "unitPrice": 300,
    "saleDate": "2026-11-19",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Novo Ambiente",
    "unitPrice": 500,
    "saleDate": "2026-11-19",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Graciosa",
    "unitPrice": 1795,
    "saleDate": "2026-11-19",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Stilus",
    "unitPrice": 255,
    "saleDate": "2026-11-20",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Filadélfia",
    "unitPrice": 56,
    "saleDate": "2026-11-20",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  },
  {
    "customerName": "Zani",
    "unitPrice": 636,
    "saleDate": "2026-11-20",
    "paymentMethod": "pix",
    "installments": null,
    "details": "Venda. Origem: mensagem."
  }
]
};

function ImportBatchCard({ batch }: { batch: ImportBatch }) {
  const router = useRouter();
  const [isImporting, setIsImporting] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const importTotal = batch.sales.reduce((total, sale) => total + sale.unitPrice, 0);
  const importCodes = useMemo(
    () =>
      batch.sales.map(
        (_, index) => `${batch.prefix}-${String(index + 1).padStart(2, "0")}`
      ),
    [batch]
  );

  useEffect(() => {
    let isActive = true;

    async function checkImportStatus() {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from("sales")
        .select("order_code")
        .in("order_code", importCodes);

      if (isActive) {
        if (!error) {
          const existingCodes = new Set(
            ((data ?? []) as Array<{ order_code: string | null }>)
              .map((sale) => sale.order_code)
              .filter(Boolean)
          );
          setIsComplete(importCodes.every((code) => existingCodes.has(code)));
        }

        setIsChecking(false);
      }
    }

    void checkImportStatus();

    return () => {
      isActive = false;
    };
  }, [importCodes]);

  const handleImport = async () => {
    const supabase = createBrowserSupabaseClient();
    setIsImporting(true);

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setIsImporting(false);
      toast.error("Sua sessão expirou. Entre novamente para importar as vendas.");
      return;
    }

    const { data: existingSales, error: lookupError } = await supabase
      .from("sales")
      .select("order_code")
      .in("order_code", importCodes);

    if (lookupError) {
      setIsImporting(false);
      toast.error("Não foi possível verificar as vendas já importadas.");
      return;
    }

    const existingCodes = new Set(
      ((existingSales ?? []) as Array<{ order_code: string | null }>)
        .map((sale) => sale.order_code)
        .filter(Boolean)
    );
    const pendingRows: SaleInsert[] = batch.sales.flatMap((sale, index) => {
      const orderCode = importCodes[index];

      if (existingCodes.has(orderCode)) {
        return [];
      }

      return [
        {
          sale_date: sale.saleDate,
          product_name: sale.productName ?? "Espuma",
          product_category: sale.productCategory ?? "Espumas",
          quantity: 1,
          unit_price: sale.unitPrice,
          payment_method: "pix",
          installments: null,
          customer_name: sale.customerName,
          order_code: orderCode,
          status: "paid",
          notes: sale.details ? `${batch.notes} ${sale.details}` : batch.notes,
          user_id: user.id
        }
      ];
    });

    if (!pendingRows.length) {
      setIsImporting(false);
      setIsComplete(true);
      toast.info(`As ${batch.sales.length} vendas deste lote já foram importadas.`);
      return;
    }

    const salesTable = supabase.from("sales") as unknown as {
      insert: (rows: SaleInsert[]) => Promise<{ error: { message: string } | null }>;
    };
    const { error: insertError } = await salesTable.insert(pendingRows);
    setIsImporting(false);

    if (insertError) {
      console.error("Erro ao importar vendas:", insertError);
      toast.error("Não foi possível importar as vendas. Tente novamente.");
      return;
    }

    setIsComplete(true);
    toast.success(
      `${pendingRows.length} ${pendingRows.length === 1 ? "venda importada" : "vendas importadas"} com sucesso.`
    );

    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <Card className="border-[rgba(138,105,47,0.24)] bg-[linear-gradient(135deg,#fffdf8,#f7efe0)]">
      <CardHeader className="pb-4">
        <CardDescription>Importação preparada</CardDescription>
        <CardTitle>{batch.title}</CardTitle>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          Total de {formatCurrencyBRL(importTotal)}. {batch.description}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          {isComplete
            ? "Este lote já foi importado e não será duplicado."
            : "O sistema verifica o lote antes de salvar para evitar registros duplicados."}
        </p>
        <Button
          onClick={handleImport}
          disabled={isChecking || isImporting || isComplete}
          className="w-full sm:w-auto"
        >
          {isComplete ? <CheckCircle2 size={17} /> : <Download size={17} />}
          {isChecking
            ? "Verificando..."
            : isImporting
            ? "Importando..."
            : isComplete
              ? "Lote já importado"
              : `Importar ${batch.sales.length} vendas`}
        </Button>
      </CardContent>
    </Card>
  );
}

export function PendingSalesImport() {
  return (
    <div className="space-y-4">
      <ImportBatchCard batch={november26SalesBatch} />
      <ImportBatchCard batch={novemberSalesBatch} />
      <ImportBatchCard batch={whatsappOctober31SalesBatch} />
      <ImportBatchCard batch={whatsappOctober23SalesBatch} />
      <ImportBatchCard batch={whatsappSalesBatch} />
      <ImportBatchCard batch={additionalSalesBatch} />
      <ImportBatchCard batch={receiptSalesBatch} />
      <ImportBatchCard batch={informedSalesBatch} />
    </div>
  );
}
