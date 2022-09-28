import chai, { expect } from "chai";

import { BN } from "bn.js";
import chai_bn from "chai-bn";

chai.use(chai_bn(BN));

const ERC1155FullSupplyMock = artifacts.require("ERC1155FullSupplyUpgradeableMock");

contract("ERC1155FullSupply", function (accounts) {
    const [holder] = accounts;

    const uri = "https://token.com";

    const firstTokenId = new BN("37");
    const firstTokenAmount = new BN("42");

    const secondTokenId = new BN("19842");
    const secondTokenAmount = new BN("23");

    beforeEach(async function () {
        this.token = await ERC1155FullSupplyMock.new();
        await this.token.initialize(uri);
    });

    context("before mint", function () {
        it("exist", async function () {
            expect(await this.token.exists(firstTokenId)).to.be.equal(false);
        });

        it("totalSupply", async function () {
            expect(await this.token.totalSupply(firstTokenId)).to.be.bignumber.equal("0");
        });

        it("totalSupplyAll", async function () {
            expect(await this.token.totalSupplyAll()).to.be.bignumber.equal("0");
        });

        it("balanceOf", async function () {
            expect(await this.token.balanceOfAll(accounts[0])).to.be.bignumber.equal("0");
        });
    });

    context("after mint", function () {
        context("single", function () {
            beforeEach(async function () {
                await this.token.mint(holder, firstTokenId, firstTokenAmount, "0x");
            });

            it("exist", async function () {
                expect(await this.token.exists(firstTokenId)).to.be.equal(true);
            });

            it("totalSupply", async function () {
                expect(await this.token.totalSupply(firstTokenId)).to.be.bignumber.equal(firstTokenAmount);
            });

            it("totalSupplyAll", async function () {
                expect(await this.token.totalSupplyAll()).to.be.bignumber.equal(firstTokenAmount);
            });

            it("balanceOf", async function () {
                expect(await this.token.balanceOfAll(accounts[0])).to.be.bignumber.equal(firstTokenAmount);
            });
        });

        context("single again", function () {
            beforeEach(async function () {
                await this.token.mint(holder, firstTokenId, firstTokenAmount, "0x");
                await this.token.mint(holder, secondTokenId, secondTokenAmount, "0x");
            });

            it("exist", async function () {
                expect(await this.token.exists(firstTokenId)).to.be.equal(true);
            });

            it("totalSupply", async function () {
                expect(await this.token.totalSupply(firstTokenId)).to.be.bignumber.equal(firstTokenAmount);
            });

            it("totalSupplyAll", async function () {
                expect(await this.token.totalSupplyAll()).to.be.bignumber.equal(
                    firstTokenAmount.add(secondTokenAmount),
                );
            });

            it("balanceOf", async function () {
                expect(await this.token.balanceOfAll(accounts[0])).to.be.bignumber.equal(
                    firstTokenAmount.add(secondTokenAmount),
                );
            });
        });

        context("batch", function () {
            beforeEach(async function () {
                await this.token.mintBatch(
                    holder,
                    [firstTokenId, secondTokenId],
                    [firstTokenAmount, secondTokenAmount],
                    "0x",
                );
            });

            it("exist", async function () {
                expect(await this.token.exists(firstTokenId)).to.be.equal(true);
                expect(await this.token.exists(secondTokenId)).to.be.equal(true);
            });

            it("totalSupply", async function () {
                expect(await this.token.totalSupply(firstTokenId)).to.be.bignumber.equal(firstTokenAmount);
                expect(await this.token.totalSupply(secondTokenId)).to.be.bignumber.equal(secondTokenAmount);
            });

            it("totalSupplyAll", async function () {
                expect(await this.token.totalSupplyAll()).to.be.bignumber.equal(
                    firstTokenAmount.add(secondTokenAmount),
                );
            });

            it("balanceOf", async function () {
                expect(await this.token.balanceOfAll(accounts[0])).to.be.bignumber.equal(
                    firstTokenAmount.add(secondTokenAmount),
                );
            });
        });
    });

    context("after burn", function () {
        context("single", function () {
            beforeEach(async function () {
                await this.token.mint(holder, firstTokenId, firstTokenAmount, "0x");
                await this.token.burn(holder, firstTokenId, firstTokenAmount);
            });

            it("exist", async function () {
                expect(await this.token.exists(firstTokenId)).to.be.equal(false);
            });

            it("totalSupply", async function () {
                expect(await this.token.totalSupply(firstTokenId)).to.be.bignumber.equal("0");
            });

            it("totalSupplyAll", async function () {
                expect(await this.token.totalSupplyAll()).to.be.bignumber.equal("0");
            });

            it("balanceOf", async function () {
                expect(await this.token.balanceOfAll(accounts[0])).to.be.bignumber.equal("0");
            });
        });

        context("double, burn only one", function () {
            beforeEach(async function () {
                await this.token.mint(holder, firstTokenId, firstTokenAmount, "0x");
                await this.token.mint(holder, secondTokenId, secondTokenAmount, "0x");
                await this.token.burn(holder, firstTokenId, firstTokenAmount);
            });

            it("exist", async function () {
                expect(await this.token.exists(firstTokenId)).to.be.equal(false);
                expect(await this.token.exists(secondTokenId)).to.be.equal(true);
            });

            it("totalSupply", async function () {
                expect(await this.token.totalSupply(firstTokenId)).to.be.bignumber.equal("0");
                expect(await this.token.totalSupply(secondTokenId)).to.be.bignumber.equal(secondTokenAmount);
            });

            it("totalSupplyAll", async function () {
                expect(await this.token.totalSupplyAll()).to.be.bignumber.equal(secondTokenAmount);
            });

            it("balanceOf", async function () {
                expect(await this.token.balanceOfAll(accounts[0])).to.be.bignumber.equal(secondTokenAmount);
            });
        });

        context("batch", function () {
            beforeEach(async function () {
                await this.token.mintBatch(
                    holder,
                    [firstTokenId, secondTokenId],
                    [firstTokenAmount, secondTokenAmount],
                    "0x",
                );
                await this.token.burnBatch(
                    holder,
                    [firstTokenId, secondTokenId],
                    [firstTokenAmount, secondTokenAmount],
                );
            });

            it("exist", async function () {
                expect(await this.token.exists(firstTokenId)).to.be.equal(false);
                expect(await this.token.exists(secondTokenId)).to.be.equal(false);
            });

            it("totalSupply", async function () {
                expect(await this.token.totalSupply(firstTokenId)).to.be.bignumber.equal("0");
                expect(await this.token.totalSupply(secondTokenId)).to.be.bignumber.equal("0");
            });

            it("totalSupplyAll", async function () {
                expect(await this.token.totalSupplyAll()).to.be.bignumber.equal("0");
            });

            it("balanceOf", async function () {
                expect(await this.token.balanceOfAll(accounts[0])).to.be.bignumber.equal("0");
            });
        });

        context("batch, burn only one", function () {
            beforeEach(async function () {
                await this.token.mintBatch(
                    holder,
                    [firstTokenId, secondTokenId],
                    [firstTokenAmount, secondTokenAmount],
                    "0x",
                );
                await this.token.burnBatch(holder, [secondTokenId], [secondTokenAmount]);
            });

            it("exist", async function () {
                expect(await this.token.exists(firstTokenId)).to.be.equal(true);
                expect(await this.token.exists(secondTokenId)).to.be.equal(false);
            });

            it("totalSupply", async function () {
                expect(await this.token.totalSupply(firstTokenId)).to.be.bignumber.equal(firstTokenAmount);
                expect(await this.token.totalSupply(secondTokenId)).to.be.bignumber.equal("0");
            });

            it("totalSupplyAll", async function () {
                expect(await this.token.totalSupplyAll()).to.be.bignumber.equal(firstTokenAmount);
            });

            it("balanceOf", async function () {
                expect(await this.token.balanceOfAll(accounts[0])).to.be.bignumber.equal(firstTokenAmount);
            });
        });
    });
});
